import axios from "axios";

const SERVER_URL = "http://localhost:5555/api/";

export default function useAPI() {
  async function POST({ location, data }) {
    const config = {
      method: "post",
      url: SERVER_URL + location,
      headers: {},
      data: data,
      withCredentials: true,
    };
    if (data) {
      try {
        const { data: result } = await axios(config);
        return result;
      } catch (error) {
        throw error;
      }
    }
  }

  async function GET({ location }) {
    const config = {
      method: "get",
      url: SERVER_URL + location,
      headers: {},
      withCredentials: true,
    };
    try {
      const { data: result } = await axios(config);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function DELETE({ location }) {
    const config = {
      method: "delete",
      url: SERVER_URL + location,
      headers: {},
      withCredentials: true,
    };
    try {
      const { data: result } = await axios(config);
      return result;
    } catch (error) {
      throw error;
    }
  }

  return { POST, GET, DELETE };
}
