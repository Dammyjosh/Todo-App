

const mongoose = require("mongoose");
 
//connect to MongoDB by specifying port to access MongoDB server
main().catch((err) => console.log(err));
 
async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect("mongodb+srv://Joshua:damton162@cluster0.nzxgb59.mongodb.net/todolistDB");
}

 
const express = require("express")
const bodyParser = require("body-parser")
const _ = require("lodash")

const app = express()



app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))


const itemsSchema = new mongoose.Schema({
name: String

})

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
name: "Welcome to your todolist"
});

const item2 = new Item({
	name: "Create a cutomise list for yourself" 
});

const item3 = new Item({

name: "<-- Hit this to delete an item."
});

const defaultItems =[item1, item2, item3]

const listSchema = {
	name: String,
	items: [itemsSchema]
     
     }

	 const List = mongoose.model("List", listSchema)



    app.get("/",function (req, res) {
    Item.find().then(function(foundItems){
    if (foundItems.length === 0) {
	
    Item.insertMany(defaultItems)
   .then(function () {
     console.log(`${Item.length} Data Stored`); // Success
     })
      .catch(function (err) {
            console.log(err);
          });
          res.redirect("/");
        } else {
          res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});
   
   

   app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
 
  List.findOne({ name: customListName })
    .then(function (foundList) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});



	
   
   app.post("/", function(req, res) {
	  
	  const itemName = req.body.newItem;
      const listName = req.body.list;
      
	  const item = new Item({
		  name: itemName
	})

    if (listName === "Today"){
        

	item.save()
	    
	  res.redirect("/")
	
	}else {
        List.findOne({ name: listName })
    .then(function (foundList) {
        foundList.items.push(item)
        foundList.save()
        res.redirect("/" + listName)
    })

     .catch(function (err) {
      console.log(err);
    });
   }
   })

	 
	app.post("/delete", function(req, res){
 
   const checkedItemId = req.body.checkbox.trim();
   const listName = req.body.listName;
 
   if(listName === "Today") {
 
    Item.findByIdAndRemove(checkedItemId)
    .then(function(foundItem){Item.deleteOne({_id: checkedItemId})})
 
    res.redirect("/");
 
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
    .then(function (foundList)
      {
        res.redirect("/" + listName);
      });
  }
 
});


	app.get("/about", function(req, res){
     res.render("about")
	})

     app.listen(3000, function(){
	console.log("server started on port 3000")
    })


