const API_URL = "http://127.0.0.1:8000"; 

export const interactionFacade = {
  getAllPosts: async () => {
    const response = await fetch(`${API_URL}/posts/all`);
    if (!response.ok) {
        throw new Error("خطا در دریافت لیست پست‌ها");
    }
    return await response.json();
  },

  addComment: async (data: { post_id: string; content: string }) => {
    const token = localStorage.getItem("token");
    
    if (!token) throw new Error("لطفا ابتدا وارد حساب کاربری خود شوید.");

    const response = await fetch(`${API_URL}/interact/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        post_id: data.post_id,
        content: data.content 
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = typeof result.detail === 'string' 
        ? result.detail 
        : JSON.stringify(result.detail);
      throw new Error(errorMessage || "خطا در ثبت کامنت");
    }
    
    return result;
  },

  reportContent: async (targetType: "post" | "comment", targetId: string) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("ابتدا وارد حساب کاربری خود شوید.");
    }

    const response = await fetch(`${API_URL}/interact/report/${targetType}/${targetId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
        if (response.status === 422) {
            throw new Error("خطای اعتبار سنجی: فیلدها یا توکن ارسالی نامعتبر است.");
        }
        const msg = result.detail ? (typeof result.detail === 'string' ? result.detail : JSON.stringify(result.detail)) : "خطای ناشناخته";
        throw new Error(msg);
    }
    return result;
  },

  getComments: async (postId: string) => {
    const response = await fetch(`${API_URL}/interact/comments/${postId}`);
    if (!response.ok) return [];
    return await response.json();
  }
};