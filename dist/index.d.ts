import { InputProps } from './common/entity';
export default class FcStressComponent {
    private report;
    private argsParser;
    /**
     * start stress test
     * @param inputs
     * @returns
     */
    start(inputs: InputProps): Promise<any>;
    /**
     * clean stress helper function and html report file
     * @param inputs
     * @returns
     */
    clean(inputs: InputProps): Promise<any>;
}
