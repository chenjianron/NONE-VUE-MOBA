
module.exports = (app) => {
    const express = require('express');
    const router = express.Router({
        mergeParams: true
    });
    const jwt = require('jsonwebtoken');
    const assert = require('http-assert');
    const AdminUser = require('../../models/AdminUser');
    const authMiddleware = require('../../middleware/auth')();
    const resourceMiddleware = require('../../middleware/resource')();

    //创建资源

    router.post('/', async (req, res) => {

        const model = await req.model.create(req.body);
        res.send(model);
    });

    //更新资源
    router.put('/:id', async (req, res) => {
        const model = await req.model.findByIdAndUpdate(req.params.id, req.body);
        res.send(model);
    });

    //删除资源
    router.delete('/:id', async (req, res) => {
        await req.model.findByIdAndDelete(req.params.id);
        res.send({
            success: true
        });
    });

    //资源列表
    router.get('/', async (req, res) => {
        const queryOptions = {};
        if (req.model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const items = await req.model.find().setOptions(queryOptions).limit(100);
        res.send(items);
    });

    //资源详情
    router.get('/:id', async (req, res) => {
        const model = await req.model.findById(req.params.id);
        res.send(model);
    });



    app.use('/admin/api/rest/:resource', authMiddleware, resourceMiddleware, router);

    const multer = require('multer');
    const MAO = require('multer-aliyun-oss');
    const upload = multer({
        storage: MAO({
            config: {
                region: 'oss-cn-hongkong',
                accessKeyId: 'LTAI4G3DAvYGm7xeJK92EW5H',
                accessKeySecret: 'wcqMLP8TQAgGNYyAp0pZVDfd5GBC6u',
                bucket: 'node-vue-moba123'
            }
        })
    });
    app.post('/admin/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
        const file = req.file;
        file.url = file.url.replace("http","https");
        res.send(file);
    });

    app.post('/admin/api/login', async (req, res) => {
        const { username, password } = req.body;
        //1.根据用户名找用户
        const user = await AdminUser.findOne({ username }).select('+password');
        assert(user, 422, '用户不存在');
        // if (!user) {
        //     return res.status(422).send({
        //         message: '用户不存在'
        //     })
        // }
        //2.校验密码；
        const isValid = require('bcrypt').compareSync(password, user.password);
        assert(isValid, 422, '密码错误');
        //3.返回token
        const token = jwt.sign({
            id: user._id,
            _id: user._id,
            username: user.username,
        }, app.get('secret'))
        res.send({ token });
    })

    //错误处理函数
    app.use(async (err, req, res, next) => {
        // console.log(err);
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}