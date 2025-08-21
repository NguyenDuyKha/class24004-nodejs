// Cài đặt package
// npm init - y
// npm install sequelize mysql2 dotenv express

// File .env
// DB_DIALECT = mysql
// DB_DATABASE = library_management_dev
// DB_USERNAME = your_username
// DB_PASSWORD = your_password
// DB_HOST = 127.0.0.1
// DB_PORT = 3306
// PORT = 3000

// File config/config.js
module.exports = {
    development: {
        dialect: process.env.DB_DIALECT,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
};

// File models / index.js
'use strict';
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.Author = require('./author')(sequelize, Sequelize);
db.Book = require('./book')(sequelize, Sequelize);
db.Member = require('./member')(sequelize, Sequelize);
db.MemberDetail = require('./memberDetail')(sequelize, Sequelize);
db.Genre = require('./genre')(sequelize, Sequelize);
db.BookGenre = require('./bookGenre')(sequelize, Sequelize);
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;

// File models/author.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Author extends Model {
        static associate(models) {
            Author.hasMany(models.Book, { foreignKey: 'authorId', as: 'books' });
        }
    }
    Author.init({
        name: { type: DataTypes.STRING, allowNull: false },
        bio: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Author',
        tableName: 'Authors',
        timestamps: true
    });
    return Author;
};

// File models/book.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        static associate(models) {
            Book.belongsTo(models.Author, { foreignKey: 'authorId', as: 'author' });
            Book.belongsToMany(models.Genre, { through: models.BookGenre, foreignKey: 'bookId', as: 'genres' });
        }
    }
    Book.init({
        title: { type: DataTypes.STRING, allowNull: false },
        isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
        publishYear: DataTypes.INTEGER,
        authorId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Book',
        tableName: 'Books',
        timestamps: true
    });
    return Book;
};

// File models/member.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Member extends Model {
        static associate(models) {
            Member.hasOne(models.MemberDetail, { foreignKey: 'memberId', as: 'detail' });
        }
    }
    Member.init({
        membershipId: { type: DataTypes.STRING, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: false }
    }, {
        sequelize,
        modelName: 'Member',
        tableName: 'Members',
        timestamps: true
    });
    return Member;
};

// File models/memberDetail.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MemberDetail extends Model {
        static associate(models) {
            MemberDetail.belongsTo(models.Member, { foreignKey: 'memberId', as: 'member' });
        }
    }
    MemberDetail.init({
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        phone: DataTypes.STRING,
        memberId: { type: DataTypes.INTEGER, unique: true, allowNull: false }
    }, {
        sequelize,
        modelName: 'MemberDetail',
        tableName: 'MemberDetails',
        timestamps: true
    });
    return MemberDetail;
};

// File models/genre.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Genre extends Model {
        static associate(models) {
            Genre.belongsToMany(models.Book, { through: models.BookGenre, foreignKey: 'genreId', as: 'books' });
        }
    }
    Genre.init({
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Genre',
        tableName: 'Genres',
        timestamps: true
    });
    return Genre;
};

// File models/bookGenre.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BookGenre extends Model {
        static associate(models) { }
    }
    BookGenre.init({}, {
        sequelize,
        modelName: 'BookGenre',
        tableName: 'BookGenres',
        timestamps: true
    });
    return BookGenre;
};

// File routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { Book, Author, Genre } = require('../models');
const { Op } = require('sequelize');
// GET all books with filters, sorting, and pagination
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 10, title, year } = req.query;
        const offset = (page - 1) * limit;
        const where = {};
        if (title) where.title = { [Op.like]: `%${title}%` };
        if (year) where.publishYear = { [Op.eq]: year };
        const books = await Book.findAll({
            where,
            include: [
                { model: Author, as: 'author' },
                { model: Genre, as: 'genres' }
            ],
            order: [['publishYear', 'DESC'], ['title', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        res.json(books);
    } catch (error) {
        next(error);
    }
});
// GET book by ID with relations
router.get('/:id', async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [
                { model: Author, as: 'author' },
                { model: Genre, as: 'genres' }
            ]
        });
        if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.json(book);
    } catch (error) {
        next(error);
    }
});
// POST create a new book
router.post('/', async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
});
// PUT update a book
router.put('/:id', async (req, res, next) => {
    try {
        const [updated] = await Book.update(req.body, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy sách' });
        const updatedBook = await Book.findByPk(req.params.id);
        res.json(updatedBook);
    } catch (error) {
        next(error);
    }
});
// DELETE a book
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await Book.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});
module.exports = router;

// File server.js
require('dotenv').config();
const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');
const db = require('./models');
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/books', bookRoutes);
db.sequelize.authenticate()
    .then(() => console.log('Kết nối cơ sở dữ liệu thành công!'))
    .catch(err => console.error('Không thể kết nối:', err));
app.listen(PORT, () => {
    console.log(`Server đang chạy tại <http://localhost>:${PORT}`);
});