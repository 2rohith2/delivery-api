import { Parcel, ParcelStatus, UserRoles } from '../types';
import { Request, Response } from 'express';
import { Router } from 'express';
import { addParcel, deleteSenderParcelById, getBikerParcelById, getBikerParcelsByStatus, getParcelById, getSenderParcelById, getSenderParcelsByStatus, updateParcel } from '../database';
import { parcelIdValidator, parcelObjecValidator } from './validator';
import { v4 } from 'uuid';
import logger from '../middleware/logger';

const parcelRouter = Router();

parcelRouter.post('/', (req: Request, res: Response) => {
  if (req.body.role === UserRoles.Biker) {
    res.status(403).send({ code: 403, message: 'Insufficient role' });
    logger.log({ level: 'error', message: `Biker with id ${req.body.user_id} tried to create parcel` });
  } else {
    try {
      const parcel: Parcel = req.body;
      parcelObjecValidator(parcel);
      const newParcel: Parcel = {
        id: v4(),
        created_time: new Date(),
        from_address: parcel.from_address,
        sender_id: req.body.user_id,
        status: ParcelStatus.New,
        to_address: parcel.to_address
      };

      res.status(201).send(addParcel(newParcel));
    } catch (error: any) {
      res.status(422).send({ code: 422, message: error.message });
    }
  }
});

parcelRouter.get('/', (req: Request, res: Response) => {
  const statusQuery = req.query.status as ParcelStatus;
  const userRole = req.body.role;

  if (statusQuery) {
    if (userRole === UserRoles.Sender) {
      const senderId = req.body.user_id;
      switch (statusQuery) {
        case ParcelStatus.New: res.json(getSenderParcelsByStatus(ParcelStatus.New, senderId)); break;
        case ParcelStatus.Transit: res.json(getSenderParcelsByStatus(ParcelStatus.Transit, senderId)); break;
        case ParcelStatus.Delivered: res.json(getSenderParcelsByStatus(ParcelStatus.Delivered, senderId)); break;
        default: res.status(422).send({ code: 422, message: 'Invalid status' }); break;
      }
    } else {
      const bikerId = req.body.user_id;
      switch (statusQuery) {
        case ParcelStatus.New: res.json(getBikerParcelsByStatus(ParcelStatus.New, bikerId)); break;
        case ParcelStatus.Transit: res.json(getBikerParcelsByStatus(ParcelStatus.Transit, bikerId)); break;
        case ParcelStatus.Delivered: res.json(getBikerParcelsByStatus(ParcelStatus.Delivered, bikerId)); break;
        default: res.status(422).send({ code: 422, message: 'Invalid status' }); break;
      }
    }
  } else {
    if (userRole === UserRoles.Sender) {
      const senderId = req.body.user_id;
      res.json(getSenderParcelsByStatus(ParcelStatus.New, senderId));
    } else {
      const bikerId = req.body.user_id;
      res.json(getBikerParcelsByStatus(ParcelStatus.New, bikerId));
    }
  }
});

parcelRouter.get('/:id', (req: Request, res: Response) => {
  const parcelId = req.params.id;

  if (req.body.role === UserRoles.Sender) {
    const senderId = req.body.user_id;
    res.json(getSenderParcelById(parcelId, senderId));
  } else {
    const bikerId = req.body.user_id;
    res.json(getBikerParcelById(parcelId, bikerId));
  }
});

parcelRouter.put('/:id', (req: Request, res: Response) => {
  if (req.body.role === UserRoles.Biker) {
    const parcelId = req.params.parcelId;
    try {
      parcelIdValidator(parcelId);

      const updatedParcel: Parcel = req.body;
      parcelObjecValidator(updatedParcel);

      const exisintgParcel = getSenderParcelById(parcelId, req.body.user_id);
      if (exisintgParcel) {
        exisintgParcel.from_address = updatedParcel.from_address;
        exisintgParcel.to_address = updatedParcel.to_address;
        res.status(202).send(updateParcel(exisintgParcel));
      } else {
        res.status(403).send({ code: 404, message: 'Parcel belongs to another user' });
      }
    } catch (error) {
      res.status(404).send({ code: 404, message: error });
    }
  } else {
    res.status(403).send({ code: 403, message: 'Insufficient role' });
  }
});

parcelRouter.delete('/:id', (req: Request, res: Response) => {
  if (req.body.role === UserRoles.Biker) {
    res.status(403).send({ code: 403, message: 'Insufficient role' });
  } else {
    try {
      const parcelId = req.params.id;
      const senderId = req.body.user_id;
      const existingParcel = getParcelById(parcelId);

      if (!existingParcel) {
        return res.status(403).send({ code: 403, message: 'Invalid parcel Id' });
      }

      if (existingParcel.status === ParcelStatus.InActive) {
        return res.status(403).send({ code: 403, message: 'Parcel is already deleted' });
      }

      if (existingParcel.sender_id !== senderId) {
        return res.status(403).send({ code: 403, message: 'Parcel belongs to another user' });
      }

      if (existingParcel.status !== ParcelStatus.New) {
        return res.status(422).send({ code: 422, message: `Parcle is already ${existingParcel.status}` });
      }

      deleteSenderParcelById(parcelId, senderId);
      return res.status(204).send();

    } catch (error: any) {
      res.status(422).send({ code: 422, message: error.message });
    }
  }
});

parcelRouter.post('/:id/pickup', (req: Request, res: Response) => {
  if (req.body.role === UserRoles.Sender) {
    res.status(403).send({ code: 403, message: 'Insufficient role' });
  } else {
    try {
      const parcelId = req.params.id;
      parcelIdValidator(parcelId);
      const parcel = getParcelById(parcelId);

      if (!parcel) throw Error('Invalid parcel id');
      if (parcel.status === ParcelStatus.InActive) throw Error('This parcel is already deleted');
      if (parcel.status === ParcelStatus.Transit) throw Error('This parcel is already transit');
      if (parcel.status === ParcelStatus.Delivered) throw Error('This parcel is already dellivered');

      parcel.status = ParcelStatus.Transit;
      parcel.biker_id = req.body.user_id;
      parcel.pick_up_time = new Date();
      res.json(updateParcel(parcel));
    } catch (error: any) {
      res.status(422).send({ code: 422, message: error.message });
    }
  }
});

parcelRouter.post('/:id/deliver', (req: Request, res: Response) => {
  if (req.body.role === UserRoles.Sender) {
    res.status(403).send({ code: 403, message: 'Insufficient role' });
  } else {
    try {
      const parcelId = req.params.id;
      parcelIdValidator(parcelId);
      const parcel = getParcelById(parcelId);

      if (!parcel) throw Error('Invalid parcel id');
      if (parcel.status === ParcelStatus.New) throw Error('This parcel is not picked yet');
      if (parcel.status === ParcelStatus.InActive) throw Error('This parcel is already deleted');
      if (parcel.status === ParcelStatus.Delivered) throw Error('This parcel is already delivered');
      if (parcel.biker_id !== req.body.user_id) throw Error('This parcel is already assigned to other biker');

      parcel.status = ParcelStatus.Delivered;
      parcel.deliver_time = new Date();
      res.json(updateParcel(parcel));
    } catch (error: any) {
      res.status(422).send({ code: 422, message: error.message });
    }
  }
});

export default parcelRouter;