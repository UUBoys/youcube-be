import { prisma } from "../db/client";

// **** Functions **** //

const getTags = async () => {
    const tags = await prisma.tags.findMany({
        select: {
            id: true,
            name: true,
        }
    });

    return tags;
}

export default {
    getTags
} as const;