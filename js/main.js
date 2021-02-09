const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
  el: '#app',
  data: {
    search: '',
    showBasket: false,
    basketUrl: '/getBasket.json',
    catalogUrl: '/catalogData.json',
    products: [],
    basketItems: [],
    filtered: [],
    imgCatalog: 'https://dummyimage.com/180x140/8c888c/0f0f0f.png',
    imgBasket: 'https://dummyimage.com/100x75/8c888c/0f0f0f.png',
  },
  methods: {
    getJson(url) {
      return fetch(url)
        .then(result => result.json())
        .catch(error => {
          console.log(error);
        })
    },
    addProduct(product) {
      this.getJson(`${API}/addToBasket.json`)
        .then(data => {
          if (data.result === 1) {
            let find = this.basketItems.find(elem => elem.id_product === product.id_product);
            if (find) {
              find.quantity++;
            } else {
              let prod = Object.assign({quantity: 1}, product);
              this.basketItems.push(prod)
            }
          } else {
            console.log('Error Add Good');
          }
        })
    },
    removeProduct(item) {
      this.getJson(`${API}/deleteFromBasket.json`)
        .then(data => {
          if (data.result === 1) {
            if (item.quantity > 1) {
              item.quantity--;
            } else {
              this.basketItems.splice(this.basketItems.indexOf(item), 1)
            }
          } else {
            console.log('Error Remove Good');
          }
        })
    },
    filterGoods() {
      let regexp = new RegExp(this.search, 'i');
      this.filtered = this.products.filter(elem =>
          regexp.test(elem.product_name)
      );
    },
  },
  mounted() {
    this.getJson(`${API + this.basketUrl}`)
      .then(data => {
        for (let elem of data.contents) {
          this.basketItems.push(elem);
        }
      });
    this.getJson(`${API + this.catalogUrl}`)
      .then(data => {
        for (let elem of data) {
          this.products.push(elem);
          this.filtered.push(elem);
        }
      });
  }
});

