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

function generateRandomString(length, chars) {
  let result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
app.get("/", (req, res) => {
  res.cookie("email", req.cookies["email"])
  res.render("login_page");
});
app.get("/urls", (req, res) => {
  let templateVars = {
    email: req.cookies["email"],
    urls: urlDatabase
  };
  app.post("/urls", (req, res) => {
    let randomString = generateRandomString(
      "6",
      "123456789abcdefghijklmnopqrstuvwxyz"
    );
    urlDatabase[randomString] = req.body.longURL;
    res.redirect(`/urls/${randomString}`);
  });


  res.render("urls_index", templateVars);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls/new", (req, res) => {
  let templateVars = {
    email: req.cookies["email"]
  }
  res.render("urls_new", templateVars);
});
app.get("/login", (req, res) => {
  res.render("login_page")
})
app.post("/login", (req, res) => {
  res.cookie("email", req.body.email);
  res.cookie("password", req.body.password)
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie("email")
  res.clearCookie("password")
  res.redirect("/")
})
app.get("/signup", (req, res) => {
  res.render("registration_page");
})
app.post("/signup", (req, res) =>{
res.cookie("email", req.body.email)
res.charset("password", req.body.password)
})
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    email: req.cookies["email"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});