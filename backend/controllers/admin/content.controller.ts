
import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma';
import { logAdminAction } from '../../services/audit.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

// --- Helper to remove temp IDs from body ---
const sanitizeInput = (body: any) => {
    const { id, ...data } = body;
    // Prisma can handle JSON fields automatically if the type is `Json` in the schema
    // and the incoming data is a valid object.
    return data;
};

// --- Hero Slides ---
export const getHeroSlides = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
        res.json(items);
    } catch (error) { next(error); }
};
export const createHeroSlide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.heroSlide.create({ data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Created Hero Slide', `ID: ${item.id}`);
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateHeroSlide = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.heroSlide.update({ where: { id }, data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Updated Hero Slide', `ID: ${id}`);
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteHeroSlide = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.heroSlide.delete({ where: { id } });
        await logAdminAction(req, 'Deleted Hero Slide', `ID: ${id}`);
        res.status(204).send();
    } catch (error) { next(error); }
};


// --- Shoppable Videos ---
export const getShoppableVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.shoppableVideo.findMany();
        res.json(items);
    } catch (error) { next(error); }
};
export const createShoppableVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.shoppableVideo.create({ data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Created Shoppable Video', `ID: ${item.id}`);
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateShoppableVideo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.shoppableVideo.update({ where: { id }, data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Updated Shoppable Video', `ID: ${id}`);
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteShoppableVideo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.shoppableVideo.delete({ where: { id } });
        await logAdminAction(req, 'Deleted Shoppable Video', `ID: ${id}`);
        res.status(204).send();
    } catch (error) { next(error); }
};

// --- Occasions ---
export const getOccasions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.occasionContent.findMany();
        res.json(items);
    } catch (error) { next(error); }
};
export const createOccasion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.occasionContent.create({ data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Created Occasion', `ID: ${item.id}`);
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateOccasion = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.occasionContent.update({ where: { id }, data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Updated Occasion', `ID: ${id}`);
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteOccasion = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.occasionContent.delete({ where: { id } });
        await logAdminAction(req, 'Deleted Occasion', `ID: ${id}`);
        res.status(204).send();
    } catch (error) { next(error); }
};

// --- Looks ---
export const getLooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.curatedLook.findMany();
        res.json(items);
    } catch (error) { next(error); }
};
export const createLook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.curatedLook.create({ data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Created Look', `ID: ${item.id}`);
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateLook = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.curatedLook.update({ where: { id }, data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Updated Look', `ID: ${id}`);
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteLook = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.curatedLook.delete({ where: { id } });
        await logAdminAction(req, 'Deleted Look', `ID: ${id}`);
        res.status(204).send();
    } catch (error) { next(error); }
};

// --- Emotions ---
export const getEmotions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.emotionCategory.findMany();
        res.json(items);
    } catch (error) { next(error); }
};
export const createEmotion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.emotionCategory.create({ data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Created Emotion', `ID: ${item.id}`);
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateEmotion = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.emotionCategory.update({ where: { id }, data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Updated Emotion', `ID: ${id}`);
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteEmotion = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.emotionCategory.delete({ where: { id } });
        await logAdminAction(req, 'Deleted Emotion', `ID: ${id}`);
        res.status(204).send();
    } catch (error) { next(error); }
};


// --- CMS Pages (Blog/Custom Pages) CRUD ---
export const getCmsPages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.cmsPage.findMany();
        res.json(items);
    } catch (error) { next(error); }
};
export const createCmsPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.cmsPage.create({ data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Created CMS Page', `ID: ${item.id}`);
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateCmsPage = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.cmsPage.update({ where: { id }, data: sanitizeInput(req.body) });
        await logAdminAction(req, 'Updated CMS Page', `ID: ${id}`);
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteCmsPage = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.cmsPage.delete({ where: { id } });
        await logAdminAction(req, 'Deleted CMS Page', `ID: ${id}`);
        res.status(204).send();
    } catch (error) { next(error); }
};

// --- Floating Info CRUD ---
export const getFloatingInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.floatingInfo.findMany();
        res.json(items);
    } catch (error) { next(error); }
};

export const createFloatingInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.floatingInfo.create({ data: sanitizeInput(req.body) });
        res.status(201).json(item);
    } catch (error) { next(error); }
};

export const updateFloatingInfo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.floatingInfo.update({ where: { id }, data: sanitizeInput(req.body) });
        res.json(item);
    } catch (error) { next(error); }
};

export const deleteFloatingInfo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.floatingInfo.delete({ where: { id } });
        res.status(204).send();
    } catch (error) { next(error); }
};

// --- Fashion Gallery ---
export const getFashionGalleryImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.fashionGalleryImage.findMany({ orderBy: { order: 'asc' } });
        res.json(items);
    } catch (error) { next(error); }
};
export const createFashionGalleryImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.fashionGalleryImage.create({ data: sanitizeInput(req.body) });
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateFashionGalleryImage = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.fashionGalleryImage.update({ where: { id }, data: sanitizeInput(req.body) });
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteFashionGalleryImage = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.fashionGalleryImage.delete({ where: { id } });
        res.status(204).send();
    } catch (error) { next(error); }
};

// --- Guided Discovery ---
export const getGuidedDiscoveryPaths = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.guidedDiscoveryPath.findMany();
        res.json(items);
    } catch (error) { next(error); }
};
export const createGuidedDiscoveryPath = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.guidedDiscoveryPath.create({ data: sanitizeInput(req.body) });
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateGuidedDiscoveryPath = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.guidedDiscoveryPath.update({ where: { id }, data: sanitizeInput(req.body) });
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteGuidedDiscoveryPath = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.guidedDiscoveryPath.delete({ where: { id } });
        res.status(204).send();
    } catch (error) { next(error); }
};

// --- Homepage Layout ---
export const getHomepageLayout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const layout = await prisma.homepageLayout.findUnique({ where: { name: 'default' } });
        res.json(layout);
    } catch (error) { next(error); }
};
export const updateHomepageLayout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { layout } = req.body;
        const updatedLayout = await prisma.homepageLayout.upsert({
            where: { name: 'default' },
            update: { layout },
            create: { name: 'default', layout },
        });
        await logAdminAction(req, 'Updated Homepage Layout');
        res.json(updatedLayout);
    } catch (error) { next(error); }
};

// --- Team Members ---
export const getTeamMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
        res.json(items);
    } catch (error) { next(error); }
};
export const createTeamMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.teamMember.create({ data: sanitizeInput(req.body) });
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateTeamMember = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.teamMember.update({ where: { id }, data: sanitizeInput(req.body) });
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteTeamMember = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.teamMember.delete({ where: { id } });
        res.status(204).send();
    } catch (error) { next(error); }
};

// --- Stat Items ---
export const getStatItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.statItem.findMany({ orderBy: { order: 'asc' } });
        res.json(items);
    } catch (error) { next(error); }
};
export const createStatItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.statItem.create({ data: sanitizeInput(req.body) });
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updateStatItem = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.statItem.update({ where: { id }, data: sanitizeInput(req.body) });
        res.json(item);
    } catch (error) { next(error); }
};
export const deleteStatItem = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.statItem.delete({ where: { id } });
        res.status(204).send();
    } catch (error) { next(error); }
};

// --- Pricing Plans ---
export const getPricingPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await prisma.pricingPlan.findMany({ orderBy: { order: 'asc' } });
        res.json(items);
    } catch (error) { next(error); }
};
export const createPricingPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await prisma.pricingPlan.create({ data: sanitizeInput(req.body) });
        res.status(201).json(item);
    } catch (error) { next(error); }
};
export const updatePricingPlan = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const item = await prisma.pricingPlan.update({ where: { id }, data: sanitizeInput(req.body) });
        res.json(item);
    } catch (error) { next(error); }
};
export const deletePricingPlan = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await prisma.pricingPlan.delete({ where: { id } });
        res.status(204).send();
    } catch (error) { next(error); }
};
