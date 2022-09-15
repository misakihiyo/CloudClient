const mainURL = "http://ec2-18-219-139-47.us-east-2.compute.amazonaws.com"
// const mainURL = "http://127.0.0.1:5000"

const fileSelect = () => {
  const docFile = document.getElementById("doc-file")
  const uploadButton = document.getElementById("upload-button")
  if (docFile.value === "") {
    uploadButton.disabled = true //button remains disabled
  } else {
    uploadButton.disabled = false //button is enabled
  }
}

const postRequest = async (url, body) => {
  const params = {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body,
  }

  return fetch(url, params)
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error)
        })
      }
      return response.json()
    })
    .then((data) => data)
    .catch(async (error) => {
      alert(error)
    })
}

const getRequest = async (url) => {
  const params = {
    method: "GET",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }

  return fetch(url, params)
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error)
        })
      }
      return response.json()
    })
    .then((data) => data)
    .catch(async (error) => {
      alert(error)
    })
}

const putRequest = async (url, body) => {
  const params = {
    method: "PUT",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body,
  }

  return fetch(url, params)
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error)
        })
      }
      return response.json()
    })
    .then((data) => data)
    .catch(async (error) => {
      alert(error)
    })
}

const mainFunctionProfile = () => {
  const username = localStorage.getItem("username")
  const uploadButton = document.getElementById("upload-button")
  const docFile = document.getElementById("doc-file")
  const uploadFileLabel = document.getElementById("upload-file-label")

  if (docFile.value === "") {
    uploadButton.disabled = true //button remains disabled
  } else {
    uploadButton.disabled = false //button is enabled
  }

  if (!username) {
    return (window.location.href = "login.html")
  }

  const url = `${mainURL}/user?name=${username}`

  getRequest(url).then((userDetails) => {
    document.getElementById("profile__username").innerHTML =
      userDetails.username
    document.getElementById("profile__fname").innerHTML = userDetails.fname
    document.getElementById("profile__lname").innerHTML = userDetails.lname
    document.getElementById("profile__email").innerHTML = userDetails.email

    if (userDetails.filename) {
      document.getElementById("download-file-label").style.display = "block"
      document.getElementById("word-count-container").style.display = "block"
      document.getElementById("word-count").innerHTML = userDetails.count
      document.getElementById("profile__doc").style.display = "block"
      document.getElementById("profile__doc").innerHTML = userDetails.filename
      document.getElementById("profile__doc").name = userDetails.filename
      uploadFileLabel.innerHTML = "Replace file in profile"
    }
  })
}

const mainFunctionUpdate = () => {
  const username = localStorage.getItem("username")
  document.getElementById("user").innerHTML = username
}

const submitRegister = async () => {
  const username = await document.getElementById("username").value
  const password = await document.getElementById("password").value

  const body = JSON.stringify({
    username: username,
    password: password,
  })

  postRequest(`${mainURL}/register-user`, body).then((data) => {
    if (data) {
      localStorage.setItem("username", data.username)
      window.location.href = "update.html"
    }
  })
}

const loginUser = async () => {
  const username = await document.getElementById("login-username").value
  const password = await document.getElementById("login-password").value

  const body = JSON.stringify({
    username: username,
    password: password,
  })

  postRequest(`${mainURL}/login-user`, body).then((data) => {
    if (data) {
      localStorage.setItem("username", data.username)
      window.location.href = "index.html"
    }
  })
}

const submitUpdate = async () => {
  const fname = await document.getElementById("fname").value
  const lname = await document.getElementById("lname").value
  const email = await document.getElementById("email").value
  const username = localStorage.getItem("username")

  const body = JSON.stringify({
    username,
    fname,
    lname,
    email,
  })

  putRequest(`${mainURL}/update-profile`, body).then((data) => {
    if (data) {
      alert("User updated")
      window.location.href = "/"
    }
  })
}

const fileUpload = () => {
  let file = document.getElementById("doc-file").files[0]
  let username = localStorage.getItem("username")
  var data = new FormData()
  data.append("file", file) // maybe it should be '{target}_cand'
  data.append("name", file.name)

  // let url = "http://localhost:5001/v1/cand"
  let url = `${mainURL}/uploader/${username}`

  fetch(url, {
    method: "POST",
    body: data,
  })
    .then(function (response) {
      return response.json()
    })
    // .then(function(data){ // use different name to avoid confusion
    .then(function (res) {
      document.getElementById("word-count").innerHTML = res.count
      document.getElementById("word-count-container").style.display = "block"
      alert(res.message)
    })
}

const fileDownload = () => {
  const filename = document.getElementById("profile__doc").name

  fetch(`${mainUrl}/download/${filename}`, { method: "GET" })
    .then((response) => {
      if (response.ok) return response.blob()
    })
    .then((blob) => {
      var url = window.URL.createObjectURL(blob)
      var a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click()
      a.remove() //afterwards we remove the element again
    })
}

const Logout = () => {
  localStorage.removeItem("username")
  window.location.href = "login.html"
}
