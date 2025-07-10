import { generateTempToken } from '../utils/jwt-manager.js';

class AdmissionService {

    async generateToken() {
        return generateTempToken();
    }

}

export default new AdmissionService();