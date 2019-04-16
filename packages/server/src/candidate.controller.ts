import {Request, Response, Router} from 'express';
import {CandidateControllerBackEnd, InitServerIdentity} from './convector';

const router: Router = Router();

// Check if the server identity has been enrolled successfully
InitServerIdentity();

router.get('/:id', async (req: Request, res: Response) => {
    try {
        let {id} = req.params;
        res.send(await CandidateControllerBackEnd.get(id));
    } catch (err) {
        console.log(JSON.stringify(err));
        res.status(500).send(err);
    }
});

export const CandidateExpressController: Router = router;