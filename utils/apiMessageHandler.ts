import { errorMessages, successMessages } from "@/constants/Messages";


const apiErrorMessageHandler = (error: any) => {
  if (error.response && error.response.data) {
    const html = error.response.data;
    const match = html.match(/<pre>(.*?)<\/pre>/s); // Extract text inside <pre>

    if (match) {
      let apiErrorMessage = match[1]
        .replace(/<br\s*\/?>/g, '\n') // Replace <br> with new line
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .trim();

      // Extract only the first sentence (before any "at ..." part)
      apiErrorMessage = apiErrorMessage.split('\n')[0].replace('Error: ', '');

      const message = errorMessages.find((item: any) => item.code === apiErrorMessage);
      
      return __DEV__ ? apiErrorMessage : message?.message;
    }
  }else{
    return 'Something went wrong';
  }
}

const apiSuccessMessageHandler = (message: string) => {
  if (message) {
      const successMessage = successMessages.find((item: any) => item.code === message);
      return successMessage?.message || 'Something went wrong';
    
  }else{
    return 'Something went wrong';
  }
}

export { apiErrorMessageHandler, apiSuccessMessageHandler };
