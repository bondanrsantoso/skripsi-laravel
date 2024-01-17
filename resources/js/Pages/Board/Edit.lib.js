import axios from "axios";

export async function upload(file, boardId = null, order = null) {
    const formData = new FormData();
    formData.append("file", file);

    if (order) {
        formData.append("order", order);
    }
    try {
        const fileUploadResponse = await axios.post(
            route("boards.artifacts.store", { board: boardId }),
            formData,
            {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                },
            }
        );

        return fileUploadResponse;
    } catch (error) {
        console.error(error);

        throw error;
    }
}
