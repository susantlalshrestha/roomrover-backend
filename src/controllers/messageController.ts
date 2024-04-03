import { Request, Response } from 'express';
import { database } from '../context'; // Prisma client

export const sendMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = await database.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const messages = await database.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  try {
    await database.message.delete({
      where: { id: messageId },
    });
    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
