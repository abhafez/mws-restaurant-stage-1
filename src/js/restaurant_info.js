let restaurant;
var map;

// Initialize Google map, called from HTML
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
};
// Get current restaurant from page URL.
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

// Create restaurant HTML and add it to the webpage
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const locationIcon = 'fas fa-map-marker-alt';
  const addressLogo = document.createElement('i');
  addressLogo.classList = locationIcon;

  const address = document.getElementById('restaurant-address');
  address.setAttribute('aria-label', 'Adress');
  address.innerHTML = restaurant.address;


  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.setAttribute('alt', restaurant.name);
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.setAttribute('aria-label', 'Cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);
    row.setAttribute('tabindex', '0');

    hours.appendChild(row);
  }
};

// Create all reviews HTML and add them to the webpage.
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  // const title = document.createElement('h2');
  // const titleDiv = document.createElement('div');
  // titleDiv.appendChild(title);
  // title.innerHTML = 'Reviews';
  // container.appendChild(titleDiv);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const divUOL = document.createElement('div');
  divUOL.setAttribute('id', 'reviews-cards');
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    const reviewDiv = document.createElement('div');
    reviewDiv.classList = 'review';
    reviewDiv.appendChild(createReviewHTML(review));
    ul.appendChild(reviewDiv);
  });
  divUOL.appendChild(ul);
  container.appendChild(divUOL);
};

// Create review HTML and add it to the webpage.
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.setAttribute('tabindex', '0');
  name.setAttribute('aria-label', `review by ${review.name}`);
  const nameDiv = document.createElement('div');
  const reviewHeadDiv = document.createElement('div');


  name.innerHTML = review.name;
  li.setAttribute('class', 'review-item');
  nameDiv.appendChild(name);
  nameDiv.className = 'reviewer';
  reviewHeadDiv.className = 'name-date';
  reviewHeadDiv.appendChild(nameDiv);
  // li.appendChild(reviewHeadDiv);

  const date = document.createElement('p');
  const dateDiv = document.createElement('div');
  dateDiv.className = 'date';
  dateDiv.appendChild(date);
  dateDiv.setAttribute('tabindex', '0');
  dateDiv.setAttribute('aria-label', review.date)
  reviewHeadDiv.appendChild(dateDiv);
  date.innerHTML = review.date;
  li.appendChild(reviewHeadDiv);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  const ratingDiv = document.createElement('div');
  ratingDiv.className = 'rate';
  ratingDiv.appendChild(rating);
  rating.setAttribute('aria-label', `Rating ${review.rating}`);
  rating.setAttribute('tabindex', '0');
  li.appendChild(ratingDiv);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  const commentsDiv = document.createElement('div');
  commentsDiv.className = 'review-text';
  commentsDiv.appendChild(comments);
  commentsDiv.setAttribute('tabindex', '0');
  li.appendChild(commentsDiv);
  li.setAttribute('role', 'list-item');

  return li;
};

// Add restaurant name to the breadcrumb navigation menu
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

// Get a parameter by name from page URL.
getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};