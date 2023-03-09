import { IReq, IRes } from "./types/express/misc";
import TagService from "@src/services/TagService";

// **** Functions **** //

const getTags = async (req: IReq, res: IRes) => {
    const tags = await TagService.getTags();

    return res.json(tags);
}

export default {
    getTags
} as const;