import repository from '../repositories/general.repository.js';

class NoticeService {
    async getNotice() {
        return await repository.findNotice();
    }

    async getComment() {
        return await repository.findComment();
    }

    async sendComment(avatar, username, comment) {
        return await repository.sendComment(avatar, username, comment);
    }
}

export default new NoticeService();