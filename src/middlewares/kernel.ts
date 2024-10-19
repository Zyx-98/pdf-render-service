import { Application } from "express";
import Http from "./http";

export default class Kernel {
    public static init(_express: Application): Application {
        _express = Http.mount(_express);

        return _express;
    }
}