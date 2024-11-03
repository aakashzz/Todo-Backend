import { ApiError } from "../utils/ApiError";
import prisma from "../db/connectionDB";
import { SubTodoStatus, Todo } from "@prisma/client";
import { SubTodo } from "@prisma/client";

export async function createTodoService(
   title: string,
   id: string
): Promise<Todo> {
   const newTodo = await prisma.todo.create({
      data: {
         title: title,
         userId: id,
      },
   });
   if (!newTodo) throw new ApiError(502, "Todo Not Created..");

   return newTodo;
}

export async function newTodoCreateService(
   content: string,
   todoId: string,
   status: SubTodoStatus,

): Promise<SubTodo> {
   const newSubTodo = await prisma.subTodo.create({
      data: {
         content: content,
         todoId: todoId,
         status: status,
      },
   });

   if (!newSubTodo) throw new ApiError(400, "Todo Not Created");
   return newSubTodo;
}

export async function getAllSubTodoService(todoId:String):Promise <any>{
    const getAllSubTodo = await prisma.todo.findMany({ 
        include:{subTodos:true}
    })
    if (!getAllSubTodo) throw new ApiError(400, "Todo Not Created");
   return getAllSubTodo;
}