
  document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentDiv = document.getElementById('content');

    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        fetch(`/public/adminboard/pages/${page}`) // عدّل المسار حسب مكان ملفاتك
          .then(response => response.text())
          .then(html => {
            contentDiv.innerHTML = html;
          })
          .catch(err => {
            contentDiv.innerHTML = "<p>حدث خطأ أثناء تحميل الصفحة</p>";
          });
      });
    });

    // تحميل صفحة افتراضية أول مرة
    const defaultPage = navLinks[0].getAttribute('data-page');
    fetch(`/public/adminboard/pages/${defaultPage}`)
      .then(response => response.text())
      .then(html => {
        contentDiv.innerHTML = html;
      });
  });




document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("[data-page]");
  const container = document.getElementById("page-container"); // مكان المحتوى المتغير

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");

      fetch(page)
        .then(res => res.text())
        .then(html => {
          container.innerHTML = html;
        })
        .catch(err => {
          container.innerHTML = "<p>تعذر تحميل الصفحة</p>";
          console.error(err);
        });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("[data-page]");
  const container = document.getElementById("page-container"); // مكان المحتوى المتغير

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");

      fetch(page)
        .then(res => res.text())
        .then(html => {
          container.innerHTML = html;
        })
        .catch(err => {
          container.innerHTML = "<p>تعذر تحميل الصفحة</p>";
          console.error(err);
        });
    });
  });
});




document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE_URL = "http://localhost:5000";
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to log in first.");
    window.location.href = "/public/authentication/login.html";
    return;
  }

  // Fetch user data and update navbar
  async function fetchUserData() {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        console.log(user);
        document.getElementById(
          "navbar-member-name"
        ).textContent = `Hi, ${user.name}`;
        document.getElementById("member-image").src =
          user.photo || "default-image.jpg";
        document.getElementById("member-name-display").textContent = user.name;

        if (user.role !== "admin") {
          alert("Unauthorized access. Redirecting...");
          window.location.href = "/unauthorized.html";
        }
      } else {
        console.error("Failed to fetch user data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Fetch user data and update page on load
  await fetchUserData();

  // Fetching latest 10 requests from the server
  async function fetchLatestRequests() {
    try {
      const requestsContainer = document.querySelector(".latest-requests");
      if (!requestsContainer) {
        console.error("Requests container not found!");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/requests/latest`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("API Error:", errorDetails);
        requestsContainer.innerHTML =
          "<p>Failed to fetch requests. Please try again later.</p>";
        return;
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (data.success && data.requests?.length) {
        requestsContainer.innerHTML = "";
        data.requests.forEach((request) => {
          if (!request.needer || !request._id) {
            return;
          }

          const requestDiv = document.createElement("div");
          requestDiv.classList.add("request");
          requestDiv.id = request._id;

          const items =
            Array.isArray(request.items) && request.items.length
              ? request.items
                  .map(
                    (item) =>
                      `<li>Item: ${item.item.name} (ID: ${item.item._id}), Quantity: ${item.quantity}</li>`
                  )
                  .join("")
              : "<li>No items</li>";

          requestDiv.innerHTML = `
    <div class="request-info">
      <p><strong>Name:</strong> ${request.needer.name || "N/A"}</p>
      <p><strong>Contact:</strong> ${request.needer.phone || "N/A"}</p>
      <p><strong>Email:</strong> ${request.needer.email || "N/A"}</p>
      <div class="items-list">
        <strong>Items:</strong>
        <ul>
          ${items}
        </ul>
      </div>
    </div>
  `;

          // Collect Button
          const collectButton = document.createElement("button");
          collectButton.textContent = "Collect";
          collectButton.addEventListener("click", () =>
            handleRequestAction(request._id, "collect")
          );

          // Reject Button
          const rejectButton = document.createElement("button");
          rejectButton.textContent = "Reject";
          rejectButton.addEventListener("click", () =>
            handleRequestAction(request._id, "reject")
          );

          // Delete Button
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", () =>
            handleRequestAction(request._id, "delete")
          );

          requestDiv.appendChild(collectButton);
          requestDiv.appendChild(rejectButton);
          requestDiv.appendChild(deleteButton);
          requestsContainer.appendChild(requestDiv);
        });
      } else {
        requestsContainer.innerHTML =
          "<p>No requests available at the moment.</p>";
      }
    } catch (error) {
      console.error("Error fetching latest requests:", error);
      const requestsContainer = document.querySelector(".latest-requests");
      requestsContainer.innerHTML =
        "<p>Failed to fetch requests. Please try again later.</p>";
    }
  }

  await fetchLatestRequests();

  // Handle request action (collect, reject, delete)
  async function handleRequestAction(requestId, action) {
    try {
      let endpoint = "";
      let method = "";

      if (action === "delete") {
        endpoint = `${API_BASE_URL}/requests/delete/${requestId}`;
        method = "DELETE";
      } else {
        endpoint = `${API_BASE_URL}/requests/update-status/${requestId}/${action}`;
        method = "PATCH";
      }

      console.log(`Making ${method} request to: ${endpoint}`);
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        document.getElementById(requestId).remove(); // Remove the request from the UI
        const message =
          action === "collect"
            ? "Request marked as collected!"
            : action === "reject"
            ? "Request marked as rejected!"
            : "Request deleted successfully!";
        alert(message);
      } else {
        console.error(
          `Error from server for ${action} on request ${requestId}:`,
          responseData
        );
        alert(`Error: ${responseData.message || "Failed to perform action."}`);
      }
    } catch (error) {
      console.error(
        `Error performing ${action} on request ${requestId}:`,
        error
      );
      alert("An error occurred. Please try again.");
    }
  }

  // Handling logout from client side
  document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.removeItem("token");
          window.location.href = "/public/landingPage.html";
        } else {
          alert("Failed to logout. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("An error occurred. Please try again.");
      });
  });
});
