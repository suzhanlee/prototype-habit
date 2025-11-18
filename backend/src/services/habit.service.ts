import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const habitService = {
  async createHabit(userId: number, data: {
    name: string;
    description?: string;
    category?: string;
    frequencyType: string;
    frequencyDetail?: Prisma.JsonValue;
    targetValue?: string;
    reminderEnabled?: boolean;
    reminderTime?: string;
    colorHex?: string;
  }) {
    const habit = await prisma.habit.create({
      data: {
        userId,
        ...data,
      },
    });

    // Create streak record
    await prisma.streak.create({
      data: {
        habitId: habit.id,
        userId,
      },
    });

    return habit;
  },

  async getHabits(userId: number, includeInactive: boolean = false) {
    const where: Prisma.HabitWhereInput = {
      userId,
      deletedAt: null,
    };

    if (!includeInactive) {
      where.isActive = true;
    }

    const habits = await prisma.habit.findMany({
      where,
      include: {
        streak: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return habits;
  },

  async getHabit(habitId: number, userId: number) {
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
        deletedAt: null,
      },
      include: {
        streak: true,
      },
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    return habit;
  },

  async updateHabit(habitId: number, userId: number, data: Partial<{
    name?: string;
    description?: string;
    category?: string;
    frequencyType?: string;
    frequencyDetail?: Prisma.JsonValue;
    targetValue?: string;
    reminderEnabled?: boolean;
    reminderTime?: string;
    colorHex?: string;
    isActive?: boolean;
  }>) {
    // Check if habit belongs to user
    const habit = await this.getHabit(habitId, userId);

    const updated = await prisma.habit.update({
      where: { id: habitId },
      data,
      include: {
        streak: true,
      },
    });

    return updated;
  },

  async deleteHabit(habitId: number, userId: number) {
    const habit = await this.getHabit(habitId, userId);

    // Soft delete
    await prisma.habit.update({
      where: { id: habitId },
      data: { deletedAt: new Date() },
    });

    return { success: true, message: 'Habit deleted' };
  },

  async toggleActive(habitId: number, userId: number, isActive: boolean) {
    const habit = await this.getHabit(habitId, userId);

    const updated = await prisma.habit.update({
      where: { id: habitId },
      data: { isActive },
      include: {
        streak: true,
      },
    });

    return updated;
  },
};
