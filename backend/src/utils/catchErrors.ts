type AsyncController = (req: any, res: any, next: any) => Promise<any>;

const catchErrors =(controller: AsyncController): AsyncController =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
      console.log("controller executed successfully",controller);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

export default catchErrors;
