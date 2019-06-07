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
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "hhhh1"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "hhhh1"
  },
  "8oondn": {
    longURL: "http://www.reddit.com",
    userID: "hhjsjs"
  }
}
// Adds user info on login
const users = {};
// generate random user id
function generateRandomString(length, chars) {
  let result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function emailLookup(email) {
  for (let i in users) {
    if (users[i].email === email) {
      return i;
    }
  }
}
// filter urls to be displayed for each user
const urlsForUser = function (id) {
  const userURLS = {};
  for (let i in urlDatabase) {
    if (urlDatabase[i].userID === id) {
      userURLS[i] = urlDatabase[i];
    }
  }
  return userURLS;
}




app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
app.get("/", (req, res) => {
  res.cookie("user_id", req.cookies["user_id"])
  res.render("login_page");
});
app.get("/urls", (req, res) => { //get and render unique user index page
  if (users[req.cookies["user_id"]]) {
    const user_id = req.cookies["user_id"];
    let templateVars = {
      user: users[user_id],
      urls: urlsForUser(user_id)
    }
    res.render("urls_index", templateVars);
  } else if (!res.cookies) {
    res.redirect("/login");
  };
})
app.post("/urls", (req, res) => { // adds user generated urls to url DB
  let randomString = generateRandomString(
    "6",
    "123456789abcdefghijklmnopqrstuvwxyz"
  );
  const currentUser = req.cookies["user_id"];
  urlDatabase[randomString] = {};
  urlDatabase[randomString]["longURL"] = req.body.longURL;
  urlDatabase[randomString]["userID"] = currentUser;
  res.redirect(`/urls/${randomString}`);

});

app.get("/urls.json", (req, res) => { //json object of urls
  const user_id = req.cookies["user_id"];
  res.json(urlDatabase);
});
app.get("/urls/new", (req, res) => { 
  if (!req.cookies) {
    res.redirect("/login")
  }
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
  const randomID = generateRandomString(8, "123456789abcdefghijklmnopqrstuvwxyz"); //login or redirect to signup
  if (emailLookup(req.body.email)) {
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

app.post("/logout", (req, res) => { //clear user info on logout
  res.clearCookie("user_id");
  res.clearCookie("password");
  res.redirect("/");
})
app.get("/register", (req, res) => {
  res.render("registration_page");
})
app.post("/register", (req, res) => { // user info logged on register
  const randomID = generateRandomString(8, "123456789abcdefghijklmnopqrstuvwxyz");
  if (req.body.email === "" || req.body.password === "" || emailLookup(req.body.email)) {
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
app.post("/urls/:shortURL/delete", (req, res) => { //delete user short urls
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});
app.get("/urls/:shortURL", (req, res) => { //show individual short urls
  const user_id = req.cookies["user_id"];
  let templateVars = {
    shortVersion: req.params.shortURL,
    longVersion: urlDatabase[req.params.shortURL],
    user: users[user_id]
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  ;
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(`${longURL}`)
});
app.post("/urls/:id", (req, res) => { //redirects  to login if there is no user id present
  const user_id = req.cookies["user_id"];
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  }
  urlDatabase[req.params.id]["longURL"] = req.body.longURL;
  res.redirect("/urls");
});