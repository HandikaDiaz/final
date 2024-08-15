// ============================================================
// Package
const express = require("express");
const app = express();
const port = 3000;
const db = require("./src/db");
const { QueryTypes } = require("sequelize");
const session = require("express-session");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const multer = require("multer");
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploadImage/");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname)
        },
    }),
});
// Package
// ============================================================
// Set Up File
app.set("view engine", "hbs");
app.set("views", "views");
app.set("trust proxy", 1)
// Set Up File
// ============================================================
// Set Up Internal Folder
app.use("/data", express.static("data"));
app.use("/uploadImage", express.static("uploadImage"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(session({
    secret: "alexa",
    resave: false,
    saveUninitialized: true,
    store: new session.MemoryStore(),
    cookie: {
        maxAge: 3600000,
        secure: false,
        httpOnly: true
    }
}));
app.use((req, res, next) => {
    res.locals.isLogin = req.session.isLogin || false
    res.locals.user = req.session.user || {}
    next()
});
// Set Up Internal Folder
// ============================================================
// Routing GET
app.get("/", renderIndex);
app.get("/provinsi", renderProvinsi);
app.get("/detail-provinsi/:de_id", renderDetail)
app.get("/kabupaten", renderKabupaten);
app.get("/delete", renderDelete);
app.get("/delete-card-provinsi/:de_id", deleteCardProvinsi)
app.get("/delete-card-kabupaten/:de_id", deleteCardKabupaten)
app.get("/register", renderRegister);
app.get("/login", renderLogin);
app.get("/blog-edit", renderEdit);
app.get("/edit-provinsi/:ed_id", provinsiEdit);
app.get("/edit-kabupaten/:ed_id", kabupatenEdit);
app.get("/logout", logout);
// Routing GET
// ============================================================
// Routing POST
app.post("/", filter)
app.post("/delete-filter", deleteFilter)
app.post("/edit-filter", editFilter)
app.post("/register", register);
app.post("/login", login);
app.post("/provinsi", upload.single("image"), provinsi);
app.post("/kabupaten", upload.single("image"), kabupaten);
app.post("/edit-provinsi/:ed_id", upload.single("image"), resultEditProvinsi);
app.post("/edit-kabupaten/:ed_id", upload.single("image"), resultEditKabupaten);
// Routing POST
// ============================================================
// Render Function
async function renderIndex(req, res) {
    try {
        const id = req.session.userId;
        const isLogin = req.session.isLogin;

        if (!isLogin) {
            return res.redirect("/login");
        };

        const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1`;
        const provinsiResult = await db.query(provinsi, {
            type: QueryTypes.SELECT,
            bind: [id]
        });

        let kabupatenResult = [];
        if (provinsiResult.length > 0) {
            const provinsiId = provinsiResult[0].id;
            const kabupatenQuery = `SELECT * FROM public.kabupaten_tb WHERE provinsi_id = $1 OR user_id = $2;`
            kabupatenResult = await db.query(kabupatenQuery, {
                type: QueryTypes.SELECT,
                bind: [provinsiId, id]
            });
        };

        res.render("index", {
            isLogin: isLogin,
            user: req.session.user,
            provinsi: provinsiResult,
            kabupaten: kabupatenResult
        });
    } catch (error) {
        console.log(error)
    };
};
async function renderProvinsi(req, res) {
    try {
        const id = req.session.userId;
        const isLogin = req.session.isLogin;

        if (!isLogin) {
            return res.redirect("/login");
        };

        res.render("provinsi");
    } catch (error) {
        console.log(error)
    };
};
async function renderDetail(req, res) {
    try {
        const id = req.params.de_id;
        const isLogin = req.session.isLogin;

        if (!isLogin) {
            return res.redirect("/login");
        };

        const provinsi = `SELECT * FROM public.provinsi_tb WHERE id = $1`;
        const provinsiResult = await db.query(provinsi, {
            type: QueryTypes.SELECT,
            bind: [id]
        });

        const kabupaten = `SELECT * FROM public.kabupaten_tb WHERE provinsi_id = $1`;
        const kabupatenResult = await db.query(kabupaten, {
            type: QueryTypes.SELECT,
            bind: [id]
        });

        res.render("detail-provinsi", {
            isLogin: isLogin,
            user: req.session.user,
            provinsi: provinsiResult[0],
            kabupaten: kabupatenResult
        });
    } catch (error) {
        console.log(error);
    };
};
async function renderKabupaten(req, res) {
    try {
        const id = req.session.userId;
        const isLogin = req.session.isLogin;

        if (!isLogin) {
            return res.redirect("/login");
        };

        const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1`;
        const provinsiResult = await db.query(provinsi, {
            type: QueryTypes.SELECT,
            bind: [id]
        });

        res.render("kabupaten", {
            isLogin: isLogin,
            user: req.session.user,
            data: provinsiResult
        });
    } catch (error) {
        console.log(error)
    };
};
async function renderDelete(req, res) {
    try {
        const id = req.session.userId;
        const isLogin = req.session.isLogin;

        if (!isLogin) {
            return res.redirect("/login");
        };

        const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1`;
        const provinsiResult = await db.query(provinsi, {
            type: QueryTypes.SELECT,
            bind: [id]
        });

        let kabupatenResult = [];
        if (provinsiResult.length > 0) {
            const provinsiId = provinsiResult[0].id;
            const kabupatenQuery = `SELECT * FROM public.kabupaten_tb WHERE provinsi_id = $1 OR user_id = $2;`
            kabupatenResult = await db.query(kabupatenQuery, {
                type: QueryTypes.SELECT,
                bind: [provinsiId, id]
            });
        };

        res.render("delete", {
            isLogin: isLogin,
            user: req.session.user,
            provinsi: provinsiResult,
            kabupaten: kabupatenResult
        });
    } catch (error) {
        console.log(error)
    };
};
async function deleteCardProvinsi(req, res) {
    try {
        const id = req.params.de_id;
        const deleteCard = `DELETE FROM public.provinsi_tb WHERE id = $1;`;

        await db.query(deleteCard, {
            type: QueryTypes.DELETE,
            bind: [id]
        });

        req.flash("success", "Provinsi deleted successfully!")
        res.redirect("/delete");
    } catch (error) {
        console.log(error);
    };
};
async function deleteCardKabupaten(req, res) {
    try {
        const id = req.params.de_id;
        const deleteCard = `DELETE FROM public.kabupaten_tb WHERE id = $1;`;

        await db.query(deleteCard, {
            type: QueryTypes.DELETE,
            bind: [id]
        });

        req.flash("projectSuccess", "Kabupaten deleted successfully!")
        res.redirect("/delete");
    } catch (error) {
        console.log(error);
    };
};
async function renderRegister(req, res) {
    res.render("register");
};
async function renderLogin(req, res) {
    res.render("login");
};
async function renderEdit(req, res) {
    try {
        const id = req.session.userId;
        const isLogin = req.session.isLogin;

        if (!isLogin) {
            return res.redirect("/login");
        };

        const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1`;
        const provinsiResult = await db.query(provinsi, {
            type: QueryTypes.SELECT,
            bind: [id]
        });

        let kabupatenResult = [];
        if (provinsiResult.length > 0) {
            const provinsiId = provinsiResult[0].id;
            const kabupatenQuery = `SELECT * FROM public.kabupaten_tb WHERE provinsi_id = $1 OR user_id = $2;`
            kabupatenResult = await db.query(kabupatenQuery, {
                type: QueryTypes.SELECT,
                bind: [provinsiId, id]
            });
        };

        res.render("render-edit", {
            isLogin: isLogin,
            user: req.session.user,
            provinsi: provinsiResult,
            kabupaten: kabupatenResult
        });
    } catch (error) {
        console.log(error);
    };
};
async function provinsiEdit(req, res) {
    try {
        const id = req.params.ed_id;
        const isLogin = req.session.isLogin;
        const provinsi = `SELECT * FROM public.provinsi_tb WHERE id = $1`
        const resultProvinsi = await db.query(provinsi, {
            type: QueryTypes.SELECT,
            bind: [id]
        });
        const pulauOptions = ["Jawa", "Sumatera", "Sulawesi", "Papua"];

        res.render("provinsi-edit", {
            isLogin: isLogin,
            user: req.session.user,
            pulauOptions: pulauOptions,
            provinsi: resultProvinsi[0]
        });
    } catch (error) {
        console.log(error);
    };
};
async function kabupatenEdit(req, res) {
    try {
        const id = req.params.ed_id;
        const userId = req.session.userId
        const isLogin = req.session.isLogin;
        const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1`
        const resultProvinsi = await db.query(provinsi, {
            type: QueryTypes.SELECT,
            bind: [userId]
        });
        const kabupaten = `SELECT * FROM public.kabupaten_tb WHERE id = $1`
        const resultKabupaten = await db.query(kabupaten, {
            type: QueryTypes.SELECT,
            bind: [id]
        });

        res.render("kabupaten-edit", {
            isLogin: isLogin,
            user: req.session.user,
            provinsi: resultProvinsi,
            kabupaten: resultKabupaten[0]
        });
    } catch (error) {
        console.log(error);
    };
};
async function logout(req, res) {
    try {
        req.flash("success", "Successfully logged out");
        req.session.destroy(() => {
            return res.redirect("/login");
        });
    } catch (error) {
        console.log(error);
        req.flash("danger", "Failed to Logout");
        res.redirect("/login");
    };
};
// Render Function
// ============================================================
// Post Function
async function filter(req, res) {
    try {
        const id = req.session.userId;
        const isLogin = req.session.isLogin;

        if (!isLogin) {
            return res.redirect("/login");
        };

        const filter = req.body.filter;
        let provinsiResult = [];
        let kabupatenResult = [];

        if (filter === "all" || !filter) {
            const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1;`;
            const kabupaten = `SELECT * FROM public.kabupaten_tb WHERE user_id = $1;`;
            provinsiResult = await db.query(provinsi, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
            kabupatenResult = await db.query(kabupaten, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
        }
        if (filter === "provinsi" || !filter) {
            const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1;`;
            provinsiResult = await db.query(provinsi, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
        };
        if (filter === "kabupaten" || !filter) {
            const kabupaten = `SELECT * FROM public.kabupaten_tb WHERE user_id = $1;`;
            kabupatenResult = await db.query(kabupaten, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
        };

        res.render("index", {
            isLogin: isLogin,
            user: req.session.user,
            provinsi: provinsiResult,
            kabupaten: kabupatenResult
        });
    } catch (error) {
        console.log(error);
    };
};
async function deleteFilter(req, res) {
    try {
        const id = req.session.userId;
        const isLogin = req.session.isLogin;

        if (!isLogin) {
            return res.redirect("/login");
        };

        const filter = req.body.filter;
        let provinsiResult = [];
        let kabupatenResult = [];

        if (filter === "all" || !filter) {
            const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1;`;
            const kabupaten = `SELECT * FROM public.kabupaten_tb WHERE user_id = $1;`;
            provinsiResult = await db.query(provinsi, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
            kabupatenResult = await db.query(kabupaten, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
        }
        if (filter === "provinsi" || !filter) {
            const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1;`;
            provinsiResult = await db.query(provinsi, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
        };
        if (filter === "kabupaten" || !filter) {
            const kabupaten = `SELECT * FROM public.kabupaten_tb WHERE user_id = $1;`;
            kabupatenResult = await db.query(kabupaten, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
        };

        res.render("delete", {
            isLogin: isLogin,
            user: req.session.user,
            provinsi: provinsiResult,
            kabupaten: kabupatenResult
        });
    } catch (error) {
        console.log(error);
    };
};
async function editFilter(req, res) {
    try {
        const id = req.session.userId;
        const isLogin = req.session.isLogin;

        if (!isLogin) {
            return res.redirect("/login");
        };

        const filter = req.body.filter;
        let provinsiResult = [];
        let kabupatenResult = [];

        if (filter === "all" || !filter) {
            const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1;`;
            const kabupaten = `SELECT * FROM public.kabupaten_tb WHERE user_id = $1;`;
            provinsiResult = await db.query(provinsi, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
            kabupatenResult = await db.query(kabupaten, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
        }
        if (filter === "provinsi" || !filter) {
            const provinsi = `SELECT * FROM public.provinsi_tb WHERE user_id = $1;`;
            provinsiResult = await db.query(provinsi, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
        };
        if (filter === "kabupaten" || !filter) {
            const kabupaten = `SELECT * FROM public.kabupaten_tb WHERE user_id = $1;`;
            kabupatenResult = await db.query(kabupaten, {
                type: QueryTypes.SELECT,
                bind: [id]
            });
        };

        res.render("render-edit", {
            isLogin: isLogin,
            user: req.session.user,
            provinsi: provinsiResult,
            kabupaten: kabupatenResult
        });
    } catch (error) {
        console.log(error);
    };
};
async function register(req, res) {
    try {
        const checkUser = `SELECT * FROM public.users_tb WHERE email = $1`;
        const userExists = await db.query(checkUser, {
            type: QueryTypes.SELECT,
            bind: [req.body.email]
        });

        if (userExists.length > 0) {
            req.flash("danger", "Sorry, your account already exists");
            return res.redirect("/register");
        } else {
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = await bcrypt.hash(req.body.password, salt);
            const values = [
                req.body.name,
                req.body.email,
                passwordHash
            ];
            const userRegister = `
            INSERT INTO public.users_tb
            (username, email, password)
            VALUES ($1, $2, $3) RETURNING id;`

            const result = await db.query(userRegister, {
                type: QueryTypes.INSERT,
                bind: values,
            });
            const newUser = result[0][0].id;

            req.session.user = { id: newUser, name: req.body.name, email: req.body.email };
            req.session.isLogin = true;
            req.session.save((err) => {
                if (err) {
                    req.flash("danger", "Your account failed to create!! Please fill in your account correctly!!");
                    return res.redirect("/register");
                }
                req.flash("success", "Your account has been successfully created!! Please log in to your account!! ");
                res.redirect("/login");
            });
        };
    } catch (error) {
        console.log(error);
        req.flash("danger", "Your account failed to create!! Please fill in your account correctly!!");
        res.redirect("/register");
    };
};
async function login(req, res) {
    try {
        const checkEmail = `SELECT * FROM public.users_tb WHERE email = $1`;
        const resultUser = await db.query(checkEmail, {
            type: QueryTypes.SELECT,
            bind: [req.body.email]
        });

        console.log("resultUser:", resultUser);

        if (resultUser.length === 0) {
            req.flash("danger", "This email does not exist!");
            return res.redirect("/login");
        }

        const user = resultUser[0];

        if (!user || !user.password) {
            req.flash("danger", "User data is incomplete!");
            return res.redirect("/login");
        }

        const checkPassword = await bcrypt.compare(req.body.password, user.password);

        if (!checkPassword) {
            req.flash("danger", "Your password is wrong!");
            return res.redirect("/login");
        };

        req.session.user = user;
        req.session.isLogin = true;
        req.session.userId = user.id;
        req.session.save((err) => {
            if (err) {
                console.log(err);
                req.flash("danger", "Login failed due to session error!");
                return res.redirect("/login");
            }
            req.flash("success", "Success to login!");
            return res.redirect("/");
        });

    } catch (error) {
        console.log(error);

    };
};
async function provinsi(req, res) {
    try {
        const id = req.session.userId;
        const values = [
            req.body.provinsi,
            req.body.diresmikan,
            req?.file?.filename,
            req.body.pulau,
            id
        ];
        const provinsi = `
        INSERT INTO public.provinsi_tb(
        nama, diresmikan, photo, pulau, user_id)
        VALUES ($1, $2, $3, $4, $5);`

        await db.query(provinsi, {
            type: QueryTypes.INSERT,
            bind: values
        });
        req.flash("success", "Provinsi added successfully!");
        res.redirect("/");
    } catch (error) {
        console.log(error);
        req.flash("danger", "Provinsi failed to add successfully!");
    };
};
async function kabupaten(req, res) {
    try {
        const id = req.session.userId;
        const namaProvinsi = req.body.pulau;
        const provinsi = `SELECT id FROM public.provinsi_tb WHERE nama = $1 LIMIT 1;`;
        const provinsiResult = await db.query(provinsi, {
            type: QueryTypes.SELECT,
            bind: [namaProvinsi]
        });
        const provinsiId = provinsiResult[0].id;
        const values = [
            req.body.kabupaten,
            req.body.diresmikan,
            req?.file?.filename,
            req.body.pulau,
            id,
            provinsiId
        ];
        const kabupaten = `
        INSERT INTO public.kabupaten_tb(
        nama, diresmikan, photo, provinsi, user_id, provinsi_id)
        VALUES ($1, $2, $3, $4, $5, $6);`

        await db.query(kabupaten, {
            type: QueryTypes.INSERT,
            bind: values
        });
        req.flash("success", "Provinsi added successfully!");
        res.redirect("/");
    } catch (error) {
        console.log(error);
        req.flash("danger", "Kabupaten failed to add successfully!");
    }
};
async function resultEditProvinsi(req, res) {
    try {
        const id = req.params.ed_id;
        const userId = req.session.userId
        const oldImage = `SELECT photo FROM public.provinsi_tb WHERE id = $1 AND user_id = $2`;
        const check = await db.query(oldImage, {
            type: QueryTypes.SELECT,
            bind: [id, userId]
        });
        const newProvinsi = {
            nama: req.body.provinsi,
            diresmikan: req.body.diresmikan,
            pulau: req.body.pulau,
            photo: req.file ? req.file.filename : check[0].photo
        };
        const values = [
            newProvinsi.nama,
            newProvinsi.diresmikan,
            newProvinsi.pulau,
            newProvinsi.photo,
            userId,
            id
        ];
        const updateProvinsi = `
        UPDATE public.provinsi_tb
        SET nama = $1,
        diresmikan = $2,
        pulau = $3,
        photo = $4,
        user_id = $5
        WHERE id = $6;`;

        await db.query(updateProvinsi, {
            bind: values
        });
        req.flash("success", "Provinsi edit successfully!")
        res.redirect("/")
    } catch (error) {
        console.log(error);
        req.flash("danger", "Provinsi failed to edit successfully!")
    };
};
async function resultEditKabupaten(req, res) {
    try {
        const id = req.params.ed_id;
        const userId = req.session.userId
        const oldImage = `SELECT photo FROM public.kabupaten_tb WHERE id = $1 AND user_id = $2`;
        const check = await db.query(oldImage, {
            type: QueryTypes.SELECT,
            bind: [id, userId]
        });
        const newKabupaten = {
            nama: req.body.kabupaten,
            diresmikan: req.body.diresmikan,
            provinsi: req.body.provinsi,
            photo: req.file ? req.file.filename : check[0].photo
        };
        const values = [
            newKabupaten.nama,
            newKabupaten.diresmikan,
            newKabupaten.provinsi,
            newKabupaten.photo,
            userId,
            id
        ];
        const updatekabupaten = `
        UPDATE public.kabupaten_tb
        SET nama = $1,
        diresmikan = $2,
        provinsi = $3,
        photo = $4,
        user_id = $5
        WHERE id = $6;`;

        await db.query(updatekabupaten, {
            bind: values
        });
        req.flash("success", "Kabupaten edit successfully!")
        res.redirect("/")
    } catch (error) {
        console.log(error);
        req.flash("danger", "Kabupaten failed to edit successfully!")
    };
};
// Post Function
// ============================================================

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});