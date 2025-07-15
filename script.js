const form = document.getElementById("reviewForm");
const stars = document.querySelectorAll("#starRating span");
let selectedRating = 0;

const reviewsKey = "companyReviews";
let reviews = JSON.parse(localStorage.getItem(reviewsKey)) || {};

// Highlight stars function
function highlightStars(rating) {
  stars.forEach((star, index) => {
    star.classList.toggle("selected", index < rating);
  });
}

// Star event listeners
stars.forEach((star, index) => {
  const ratingValue = index + 1;

  star.addEventListener("mouseover", () => highlightStars(ratingValue));
  star.addEventListener("mouseout", () => highlightStars(selectedRating));
  star.addEventListener("click", () => {
    selectedRating = ratingValue;
    highlightStars(selectedRating);
  });
});

// Save reviews to localStorage
function saveReviews() {
  localStorage.setItem(reviewsKey, JSON.stringify(reviews));
}

// Render reviews after search
function renderReviews(company) {
  const display = document.getElementById("reviewsDisplay");
  const title = document.getElementById("companyTitle");
  const summary = document.getElementById("reviewSummary");
  const list = document.getElementById("reviewsList");

  list.innerHTML = "";
  summary.innerHTML = "";
  title.innerHTML = "";

  if (!company || !reviews[company] || reviews[company].length === 0) {
    display.classList.remove("hidden");
    title.textContent = company || "No company";
    summary.textContent = "No reviews found.";
    return;
  }

  const companyReviews = reviews[company];
  const avgRating = (
    companyReviews.reduce((sum, r) => sum + r.rating, 0) / companyReviews.length
  ).toFixed(1);

  title.textContent = company;
  summary.innerHTML = `Total Reviews: ${companyReviews.length} <br> Average Rating: ${avgRating}`;

  companyReviews.forEach((r, index) => {
    const div = document.createElement("div");
    div.classList.add("review-card");
    div.innerHTML = `
      <p><strong>Pros:</strong> ${r.pros}</p>
      <p><strong>Cons:</strong> ${r.cons}</p>
      <div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      <button class="delete-btn" data-company="${company}" data-index="${index}">Delete</button>
    `;
    list.appendChild(div);
  });

  display.classList.remove("hidden");
}

// Delete review handler
document.getElementById("reviewsList").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const company = e.target.dataset.company;
    const index = parseInt(e.target.dataset.index);

    if (reviews[company]) {
      reviews[company].splice(index, 1);
      if (reviews[company].length === 0) {
        delete reviews[company];
      }
      saveReviews();
      renderReviews(company);
    }
  }
});

// Submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const company = document.getElementById("companyName").value.trim().toLowerCase();
  const pros = document.getElementById("pros").value.trim();
  const cons = document.getElementById("cons").value.trim();

  if (!company || !pros || !cons || selectedRating === 0) {
    alert("Please fill out all fields and select a rating.");
    return;
  }

  if (!reviews[company]) reviews[company] = [];
  reviews[company].push({ pros, cons, rating: selectedRating });

  saveReviews();

  form.reset();
  selectedRating = 0;
  highlightStars(0);
  alert("Review submitted!");
});

// Search button
document.getElementById("searchReview").addEventListener("click", () => {
  const search = document.getElementById("searchCompany").value.trim().toLowerCase();
  renderReviews(search);
});

// On page load, optionally you can show nothing or last searched reviews
window.addEventListener("load", () => {
  document.getElementById("reviewsDisplay").classList.add("hidden");
});
