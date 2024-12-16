import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        role: true,
        registrationDate: true,
        packages: {
          select: {
            trackingCode: true,
            status: true,
            deliveryDate: true
          }
        }
      }
    });

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts' });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        registrationDate: true,
        packages: {
          select: {
            trackingCode: true,
            status: true,
            deliveryDate: true
          }
        }
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updatePackageStatus = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { status, daysRemaining, message } = req.body;

    const updatedPackage = await prisma.package.update({
      where: { id: packageId },
      data: {
        status,
        daysRemaining,
        messages: {
          create: {
            content: message,
            userId: req.user.id
          }
        }
      }
    });

    res.json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating package status' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    // Update the message content
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content }
    });

    res.json({ message: 'Message updated successfully', updatedMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message' });
  }
};
