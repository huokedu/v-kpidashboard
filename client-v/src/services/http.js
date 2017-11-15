import axios from 'axios'

export default {
  getAppSettings: function () {
    axios
        .get('/api/appsettings')
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
  }
}
