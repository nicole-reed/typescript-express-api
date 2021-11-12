import { Response } from 'express';
import NotFoundError from './errors/notFound.error';
import ForbiddenError from './errors/forbidden.error';
import UnauthorizedError from './errors/unauthorized.error';

export default function handleError(error: unknown, res: Response) {
  if (error instanceof NotFoundError) {
    res.status(404).send({ message: error.message });
  } else if (error instanceof ForbiddenError) {
    res.status(403).send({ message: error.message });
  } else if (error instanceof UnauthorizedError) {
    res.status(401).send({ message: error.message });
  } else if (error instanceof Error) {
    res.status(500).send({ message: error.message });
  } else {
    res.status(500).send({ message: 'Unexpected error has occured.' });
  }
}
