//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { getDate } = require("./date");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



let workList = []; 

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1/todolistDB');

const itemsSchema = {
  name: String
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item ({
  name: "Sofa"
});

const item2 = new Item({
  name: "Chair"
});

const item3 = new Item({
  name: "Table"
});

const defaultItems = [item1, item2, item3];

const ListSchema ={
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model('List', ListSchema);




app.get("/", function(req, res){

  Item.find({},function(err, foundItems){
    
    if(foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
           if(err){
          console.log(err);
           } else{
          console.log("Items inserted");
          }
           });
           res.redirect("/");
          }
    else{
      res.render("list", { ListTitle: "Today",newListItems: foundItems});
    }
  });
});


app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;

  List.findOne({name: customListName},function(err, foundList){
    if(!err){
      if(!foundList){
        //Create a new List
        const list = new List({
          name: customListName,
          items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName );
      
      } else{
        //Show existing list
        res.render("list", {ListTitle: foundList.name ,newListItems: foundList.items});
      }
  }});
  
  
});





app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const listname = req.body.list;

  const item = new Item({
    name: itemName
  });
   if(listname === "Today"){
        item.save();
        res.redirect("/");
   } else {
        List.findOne({name: listname},function(err, foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listname);
        });
      }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId , function(err, foundItems){
  
      res.redirect("/");
    
  });
});







// app.get("/work", function(req, res){
//   res.render("work" ,{ListTitle: "Work List" , 
//   newListItems: workList});
// });

// app.post("/work", function(req, res){
//   let item = req.body.newItem;
//   workList.push(item);
//   res.redirect("/work");
// });

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
