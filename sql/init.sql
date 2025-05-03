CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  place_id VARCHAR(64) NOT NULL,
  shop VARCHAR(255),
  bookmark TINYINT(1) DEFAULT 0,
  business_status VARCHAR(32),
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  n_review INT,
  star DECIMAL(3,2),
  vicinity VARCHAR(255),
  geometry JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE filters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64),
  location VARCHAR(255),
  radius INT,
  cuisine VARCHAR(64),
  min_budget INT,
  max_budget INT,
  review_count INT,
  rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
