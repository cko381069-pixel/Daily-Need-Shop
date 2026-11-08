const multer = require("multer");
const path = require("path");


// =========================
// IMAGE STORAGE
// =========================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            path.join(
                __dirname,
                "..",
                "uploads"
            )
        );

    },

    filename: function (req, file, cb) {

        const extension =
            path.extname(file.originalname);

        const fileName =
            "category-" +
            Date.now() +
            extension;

        cb(
            null,
            fileName
        );

    }

});


// =========================
// IMAGE FILTER
// =========================

const fileFilter =
    function (req, file, cb) {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                ),
                false
            );

        }

    };


// =========================
// MULTER UPLOAD
// =========================

const uploadCategoryImage =
    multer({

        storage: storage,

        fileFilter: fileFilter,

        limits: {
            fileSize: 5 * 1024 * 1024
        }

    });


// =========================
// EXPORT
// =========================

module.exports = {
    uploadCategoryImage
};