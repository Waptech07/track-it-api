import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

export const createPackage = async (req, res) => {
  try {
    const { trackingCode, name, country, email } = req.body;
    const userId = req.user.id;

    const deliveryDate = addDays(new Date(), 5);

    const pacKage = await prisma.package.create({
      data: {
        trackingCode,
        status: 'processing',
        daysRemaining: 5,
        deliveryDate,
        lastChecked: new Date(),
        userId
      }
    });

    res.status(201).json(pacKage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating package tracking' });
  }
};

export const getPackage = async (req, res) => {
  try {
    const { trackingCode } = req.params;

    const pacKage = await prisma.package.findUnique({
      where: { trackingCode },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!pacKage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json(pacKage);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching package' });
  }
};

export const getUserPackages = async (req, res) => {
  try {
    const userId = req.user.id;

    const packages = await prisma.package.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user packages' });
  }
};