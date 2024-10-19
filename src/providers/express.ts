import express from 'express';
import "express-async-errors"
import Bootstrap from "@/middlewares/kernel"
import Routers from './routers';
import Locals from './locals';
import ExceptionHandler from "@/exception/handler"
import Log from '@/utils/log';


class Express {
    public express: express.Application;

    constructor() {
        this.express = express();
        
        this.mountMiddlewares()
        this.mountRoutes()
    }

    private mountMiddlewares (): void {
		this.express = Bootstrap.init(this.express);
	}

    private mountRoutes (): void {
		this.express = Routers.mount(this.express);
	}

    public static init (): Express {
        return new this();
    }

    public start (): any {
		const port: number = Locals.config().port;

		this.express.use(ExceptionHandler.errorHandler);

		this.express.listen(port, () => {
			return Log.info(`Server :: Running @ 'http://localhost:${port}'`);
		}).on('error', (_error) => {
			return Log.error(_error.message);
		});
	}
}


export default Express.init()