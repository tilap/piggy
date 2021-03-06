import {parse as stackParser} from 'springbokjs-errors';
import logger from 'library/logger';

export default function *(next) {
  try {
    yield next;
  } catch (err) {
    logger.error(stackParser(err).toString());

    // 401 (require auth) and 404 alread managed with redirectOnHtmlStatus
    if (this.status === 401 || this.status === 404) {
      return next;
    }

    // Display error in development environement
    if (config.display_error) {
      const htmlStackRenderer = new HtmlStackRenderer();
      this.status = 500;
      this.body = htmlStackRenderer.render(err);
    } else { // Or display an error page for user
      return next;
    }
  }
}
