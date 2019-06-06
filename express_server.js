let express = require("express");
let app = express();
let PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {}

function generateRandomString(length, chars) {
  let result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function emailLookup(email){
  for (let i in users){
    if (users[i].email === email){
      return i;
    }
 }
}


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
app.get("/", (req, res) => {
  res.cookie("user_id", req.cookies["user_id"])
  res.render("login_page");
});
app.get("/urls", (req, res) => {
const user_id = req.cookies["user_id"];
  
let templateVars = {
    user: users[user_id],
    urls: urlDatabase
    
  };
  res.render("urls_index", templateVars);
})
  app.post("/urls", (req, res) => {
    let randomString = generateRandomString(
      "6",
      "123456789abcdefghijklmnopqrstuvwxyz"
    );
    urlDatabase[randomString] = req.body.longURL;
    res.redirect(`/urls/${randomString}`);
  });

app.get("/urls.json", (req, res) => {
  const user_id = req.cookies["user_id"];
  res.json(urlDatabase);
});
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  
  let templateVars = {
    user: users[user_id]
  }
  res.render("urls_new", templateVars);
});
app.get("/login", (req, res) => {
  const user_id = req.cookies["user_id"];
  res.render("login_page")
})
app.post("/login", (req, res) => {
  const randomID = generateRandomString(8, "123456789abcdefghijklmnopqrstuvwxyz");
  if  (emailLookup(req.body.email)){
    users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: req.body.password,
  }  
  res.cookie("user_id", randomID, );
  res.redirect("/urls");
  } else {
    res.status(400).send("You don't have an account yet.")
  }
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.clearCookie("password")
  res.redirect("/")
})
app.get("/register", (req, res) => {
  res.render("registration_page");
})
app.post("/register", (req, res) => {
  const randomID = generateRandomString(8, "123456789abcdefghijklmnopqrstuvwxyz");
  if(req.body.email === "" || req.body.password === "" || emailLookup(req.body.email)) {
    res.status(400).send("Please enter your info or check that you're not already registered");
  } else {
users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: req.body.password,
  }
  res.cookie("user_id", randomID);
  res.redirect("/urls");
  }
})
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    email: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    users: users,
    userIDS: req.cookies["user_id"],
   
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"];
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});