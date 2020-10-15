const router = require('koa-router')()
const qiniu = require('qiniu')
const {
  scope,
  accessKey,
  secretKey
} = require('../../config/qiniu_config');
const {
  query
} = require('../../utils/query')


router.post('/upload', async (ctx) => {
  /* 接收formData数据 */
  const {
    openid,
    exerciseId,
    exerciseIndex
  } = ctx.request.body

  const classInfo = await query(`SELECT class_id FROM student_class WHERE student_id IN (SELECT student_id FROM student_list WHERE open_id = '${openid}')`)
  const {
    class_id: classId
  } = classInfo[0]

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z2

  const options = {
    scope,
    // expires: 3600,
    saveKey: 'ImageMessages/$(etag)',
    mimeLimit: 'image/*',
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()

  /* 图片路径为 `uploadImage/exercise/班级id/题库id/题号index` */
  const key = `uploadImage/exercise/${classId}/${exerciseId}/${exerciseIndex}.png`
  const file = ctx.request.files.files.path
  const name = ctx.request.files.files.name


  // ctx.response.body = {}

  // console.log('start')
  // console.log(ctx.request)
  // console.log(ctx.request.files)
  // console.log(name)
  // console.log(file)


  formUploader.putFile(uploadToken, key, file, putExtra, (err, res, info) => {
    console.log(err)
    console.log(res)
    console.log(info)

    ctx.response.body = {

    }
  })


})

module.exports = router
