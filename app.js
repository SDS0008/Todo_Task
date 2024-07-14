const express = require("express");

const {open} = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();

const dbPath = path.join(__dirname,"todoapp.db");

app.use(express.json());

let db = null;

const initilaizeDbAndServer = async()=> {

    try {
        db = await open({
          filename: dbPath,
          driver: sqlite3.Database,
        });
        const port = 5200;
        app.listen(port, () => {
          console.log(`DB Connected\nServer Running at ${port}`);
        });
      } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
      }

};

initilaizeDbAndServer();

//table names is todo
//Add todo tasks to Database Table...
app.post("/todos/", async(req,res) => {
try {
    const {
        id,
todo,
priority,
status,
category,
dueDate
       } = req.body;

 const addTodoQuery = `
INSERT INTO todo(
 id	,
todo ,
priority,
status	,
category,
dueDate
) 
VALUES(
 ${id},
 "${todo}",
 "${priority}",
 "${status}",
  "${category}",
 "${dueDate}");
 `;

        const todoResp = await db.run(addTodoQuery);

        res.status(201).json({
            message :`todos added to the todo Table `
        });


} catch (error) {
    console.log("todos" , error.message);
    res.status(500).send("Internal Server Error");
}
});



//Get a Single todo based on todoId from Table...
app.get("/todos/:todoId", async(req,res) => {
    try {
     
        const {todoId} = req.params;

        const fetchQuery = `SELECT *  from todo WHERE id=${todoId};`;

        const singletodo  = await db.get(fetchQuery);

    
            res.status(200).json({
                message :` Fetched  todoId : ${todoId} from state Table`, singletodo : singletodo
            });
    
    
    } catch (error) {
        console.log("todos" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });


    
//Update Todo status and Add to Database Table...
app.put("/todos/:todoId/", async(req,res) => {
    try {
        const {todoId} = req.params;
        const {status} = req.body;
    
     const updateStatusQuery =  `UPDATE todo SET  status = '${status}' WHERE  id = ${todoId}`;
     
    
            const todoStatusResp = await db.run(updateStatusQuery);
    
            res.status(200).json({
                message :`Todo status updated Successfully with todoId : ${todoId}`
            });

    } catch (error) {
        console.log("todos" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });

    
//Update Todo priority and Add to Database Table...
app.put("/todos/:todoId/", async(req,res) => {
    try {
        const {todoId} = req.params;
        const {priority} = req.body;
    
        const updatePriorityQuery =  `UPDATE todo SET  priority = '${priority}' WHERE  id = ${todoId}`;
        
       
               const todoPriorityResp = await db.run(updatePriorityQuery);
       
               res.status(200).json({
                   message :`Todo Priority is updated Successfully on todoId : ${todoId}`
               });
   

    } catch (error) {
        console.log("todos" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });

    
//Update Todo category  and Add to Database Table...
app.put("/todos/:todoId/", async(req,res) => {
    try {
        const {todoId} = req.params;
        const {category} = req.body;
    
        const updateCategoryQuery =  `UPDATE todo SET  category = '${category}' WHERE  id = ${todoId}`;
        
       
               const todoCategoryResp = await db.run(updateCategoryQuery);
       
               res.status(200).json({
                   message :`Todo Category is updated Successfully on todoId : ${todoId}`
               });
   

    } catch (error) {
        console.log("todos" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });

    
//Update Todo table todo and Add to Database Table...
app.put("/todos/:todoId/", async(req,res) => {
    try {
        const {todoId} = req.params;
        const {todo} = req.body;
    
        const updateTodoQuery =  `UPDATE todo SET  todo = '${todo}' WHERE  id = ${todoId}`;
        
       
               const todoResp = await db.run(updateTodoQuery);
       
               res.status(200).json({
                   message :`Todos table  TODO  is updated Successfully on todoId : ${todoId}`
               });
   

    } catch (error) {
        console.log("todos" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });

    
//Update Todo dueDate and Add to Database Table...
app.put("/todos/:todoId/", async(req,res) => {
    try {
        const {todoId} = req.params;
        const {dueDate} = req.body;
    
        const updateDueDateQuery =  `UPDATE todo SET  dueDate = '${dueDate}' WHERE  id = ${todoId}`;
        
       
               const todoDueDateResp = await db.run(updateDueDateQuery);
       
               res.status(200).json({
                   message :`Todo DueDate is updated Successfully on todoId : ${todoId}`
               });
   

    } catch (error) {
        console.log("todos" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });


    
//Delete todo from Database Table...
app.delete("/todos/:todoId", async(req,res) => {
    try {
        const {todoId} = req.params;
       
    
     const deleteTodoQuery =  `DELETE FROM todo WHERE id = ${todoId}`;
     
    
            const todosresp = await db.run(deleteTodoQuery);
    
            res.status(201).json({
                message :` Todo deleted Successfully with TodoId : ${todoId}`
            });
    
    
    } catch (error) {
        console.log("todos" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });

    //fliters Api's..
    //path--> http://localhost:5200/todos/?status=TO%20DO 
    // api...({status="",priority="",category="",search_q=""})...({[OR operator]})
    app.get("/todos/", async(req,res)=>{

        try {
            const {status="",priority="",category=""} = req.query;

            const fetchQuery = `SELECT * FROM todo WHERE status = '${status}' OR  category = '${category}' OR priority = '${priority}' `;

            const todoResp2 = await db.all(fetchQuery);

            res.status(201).json({
                message : `Values are Fetched `, todoResp:todoResp2, 
            })
            
        } catch (error) {
            console.log("todos" , error.message);
            res.status(500).send("Internal Server Error");
        }
    });

//API for search_q...
//path :--->  http://localhost:5200/todoserach_q/?search_q=buy 
    app.get("/todoserach_q/", async(req,res)=>{

        try {
            const {search_q=""} = req.query;

            const fetchQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'`;

            const todoResp = await db.all(fetchQuery);

            res.status(201).json({
                message : `Search_q Values are Fetched `, todoResp:todoResp, 
            })
            
        } catch (error) {
            console.log("todoserach_q" , error.message);
            res.status(500).send("Internal Server Error");
        }
    });


 // http://localhost:5200/todo/?status=DONE&priority=HIGH -->api...({status="",priority="",category=""})...({[AND operator]})
    app.get("/todo/", async(req,res)=>{

        try {
            const {status="",priority="",category=""} = req.query;

            const sqlQuery = `SELECT * FROM todo WHERE ( priority = '${priority}' AND status = '${status}') OR (category = '${category}' AND status = '${status}') OR (category = '${category}' AND priority = '${priority}'); `;

            const todoResp = await db.all(sqlQuery);

            res.status(201).json({
                message : `Values are Fetched by using AND Operator`, todoResp:todoResp, 
            })
            
        } catch (error) {
            console.log("todo" , error.message);
            res.status(500).send("Internal Server Error");
        }
    });


        
//path :--->  http://localhost:5200/agenda/?date=2021-12-12
//dueDate Api...
    app.get("/agenda/", async(req,res)=>{

        try {
            const {date=""} = req.query;

            const fetchQuery = `SELECT * FROM todo WHERE dueDate = '${date}'`;

            const todoResp = await db.all(fetchQuery);

            res.status(201).json({
                message : `Date Values are Fetched `, todoResp:todoResp, 
            })
            
        } catch (error) {
            console.log("agenda" , error.message);
            res.status(500).send("Internal Server Error");
        }
    });
