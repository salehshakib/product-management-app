import { BASE_URL } from "@/api/endpoints/base-url";

const buildUrlWithParams = (url: string, params?: Record<string, any>) => {
  if (!url || typeof url !== "string") {
    throw new Error(
      "Invalid URL provided. Ensure the URL is a non-empty string."
    );
  }

  const newUrl = new URL(url, BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => newUrl.searchParams.append(key, item));
      } else {
        newUrl.searchParams.append(key, String(value));
      }
    });
  }

  return newUrl.toString();
};
const customFetch = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body: any = null,
  isMultipart = false
) => {
  // Get token if available
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isMultipart ? {} : { "Content-Type": "application/json" }),
  };

  const options: RequestInit = {
    method,
    headers,
    ...(body && { body: isMultipart ? body : JSON.stringify(body) }),
  };

  try {
    const fullUrl = new URL(url, BASE_URL).toString();

    const response = await fetch(fullUrl, options);

    console.log(response);

    const contentType = response.headers.get("Content-Type") || "";

    const responseData = contentType.includes("application/json")
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok) {
      // Handle unauthorized errors
      if (response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Unauthorized. Redirecting to login...");
      }
      throw responseData;
    }

    // Check for authorization error message in successful response
    if (
      responseData.message === "Authorization token required." &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Authorization token required. Redirecting to login...");
    }

    return responseData;
  } catch (error: any) {
    console.log("Fetch error:", error);
    throw error;
  }
};

export const fetchGet = async (url: string, params?: Record<string, any>) => {
  const fullUrl = buildUrlWithParams(url, params);
  return customFetch(fullUrl, "GET", null, false);
};

export const fetchPost = async (url: string, body: any, isMultipart = false) =>
  customFetch(url, "POST", body, isMultipart);

export const fetchPut = async (url: string, body: any, isMultipart = false) =>
  customFetch(url, "PUT", body, isMultipart);

export const fetchPatch = async (url: string, body: any, isMultipart = false) =>
  customFetch(url, "PATCH", body, isMultipart);

export const fetchDelete = async (url: string, body: any = null) =>
  customFetch(url, "DELETE", body, false);
