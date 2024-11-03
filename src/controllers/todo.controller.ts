import { User } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { AuthRequest } from "../middlewares/authorize.middleware";
import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createTodoService, getAllSubTodoService, newTodoCreateService } from "../services/todo.services";

const createTodoController = asyncHandler(async function(req:AuthRequest,res:Response){
    const {title} = req.body;
    const id = req.user?.id;

    if(!title){
        throw new ApiError(401,"Title Not Here Please ReCheck")
    }
    const todoResponse = await createTodoService(title,id!);
    return res.status(200).json(
        new ApiResponse(200,todoResponse,"Todo Created")
    )
})

const newTodoController = asyncHandler(async function(req:AuthRequest,res:Response){
    const {content,status,todoId} = req.body;

    if(!content && !status && !todoId){
        throw new ApiError(400,"User Required Input Not Send!");
    }
    const responseOfNewTodo = await newTodoCreateService(content,todoId,status);
    if(!responseOfNewTodo) throw new ApiError(503,"New Todo Service Error: ");
    return res.status(201).json(
        new ApiResponse(201,responseOfNewTodo,"SubTodo Created")
    )
})
const getAllSubTodoController = asyncHandler(async function(req:AuthRequest,res:Response){
    const {todoId} = req.params;

    if(!todoId){
        throw new ApiError(400,"User Required Input Not Send!");
    }
    const responseOfAllSubTodo = await getAllSubTodoService(todoId)
    if(!responseOfAllSubTodo) throw new ApiError(503,"New Todo Service Error: ");
    return res.status(200).json(
        new ApiResponse(200,responseOfAllSubTodo,"Get All SubTodo")
    )
})

export {createTodoController,newTodoController,getAllSubTodoController}