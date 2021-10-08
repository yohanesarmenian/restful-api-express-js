const express = require('express')
const res = require('express/lib/response')
const app = express()
const port = 8000

// membuat sebuah variabel posts, yang mengambil data dari post.json yang sudah di buat (data dummy)
let posts = require('./db/post.json')

// untuk menggunakan ulencaded di postman
app.use(express.json())
app.use(express.urlencoded({extended: false}))


//mencoba melakukan get all data list
app.get('/api/v1/posts', (req, res) => {
  res.status(200).json(posts) //memberikan status sukses jika berhasil mengambil data dari post.json  
})

//mencoba melakukan get one data by 'id' from data list, post merupakan variable baru
app.get('/api/v1/posts/:id', (req, res) => {
    const post = posts.find(i => i.id === +req.params.id) // i merupakan data yang di cari,  find merupakan fungsi java script untuk mencari data, + pada req.param.id harus ada agar dijadikan number, karena secara default semuanya string
     res.status(200).json(post)   
})


//mencoba melakukan update/post dari data yang sudah ada
app.post('/api/v1/posts', (req, res) => {
    const {
        title,
        body
    } = req.body //destruct req.body ini bentuk dari 

    // let myJson = request.body;      
    // let myValue = request.body.myKey;

    // mendapatkan ID baru untuk data yang dimasukan
    const id = posts[posts.length - 1].id + 1 //id nya di increment secara otomatis misal ada 2 (0, 1 , 2 index array), berarti di 2-1 = 1+1 = 2, maka titik awal index saat data masuk akan di mulai dari index ke 2 (id:3) dan akan di jadikan id selanjutnya (incase kalau nambah 1 = id 4)
    const post = {
        id,
        title,
        body
    }
    posts.push(post) //mengirim data ke database dummy
    res.status(200).json(post)
})


//mencoba mengubah data (PUT)
app.put('/api/v1/posts/:id', (req, res) => {
    let post = posts.find(i => i.id === +req.params.id)
    // untuk menghindari parameter yang tidak diinginkan
    const params = {
        title: req.body.title, 
        body: req.body.body
    } 

    // spreding
    post = {...post, ...params}
    
    //update post resource
    posts = posts.map(i => i.id === post.id ? post : i)
    res.status(200).json(post)
})

//mencoba menghapus data (del)
app.delete('/api/v1/posts/:id', (req, res) => {
    posts = posts.filter(i => i.id !== +req.params.id)
    res.status(200).json({
        message: `Post dengan id ${req.params.id} sudah berhasil dihapus!`
    })
})


//test handle 404 get data by id
app.get('/api/v1/posts/:id', function (req, res, next) {
    fs.readFile('/file-does-not-exist', function (err, post) {
      if (err) {
        next(err) // Pass errors to Express.
      } else {
        res.send(post)
      }
    })
  })

// berfungsi untuk menentukan port/alamat dan url yang akan digunakan
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })