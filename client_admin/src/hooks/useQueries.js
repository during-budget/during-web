export default function useQueries() {
  const query = window.location.search.substring(1);
  const queries = {};
  for (let item of query.split("&")) {
    const pair = item.split("=");
    queries[pair[0]] = pair[1];
  }
  return queries;
}
