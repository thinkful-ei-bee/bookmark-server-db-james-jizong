create table bookmarks(
  id INTEGER primary key generated by default as identity,
  title text NOT NULL,
  url text NOT NULL,
  description text,
  rating integer
);

