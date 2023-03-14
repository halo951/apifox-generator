import { IApiGroupNameMap, IGenerateTemplate } from '../intf/IConfig';
import { TSimpleTrees } from '../intf/ISimpleTree';
/** 选择是否创建配置 */
export declare const runChoiceCreateForm: () => Promise<boolean>;
/** 选择项目语言 */
export declare const runLanguageForm: (language?: 'js' | 'ts') => Promise<'js' | 'ts'>;
/** 导出目录配置 */
export declare const runOutputDirForm: (outDir?: string) => Promise<string>;
/** 选择是否创建公共导出文件 */
export declare const runAppendIndexFileForm: (appendIndexFile?: boolean) => Promise<boolean>;
/** 选择是否开启严格模式 */
export declare const runConfirmStrictMode: (strict: any) => Promise<boolean>;
/** 设置项目模板 */
export declare const runTemplateForm: (template: IGenerateTemplate) => Promise<IGenerateTemplate>;
/** token 检查 及登录 */
export declare const runLoginForm: (token?: string) => Promise<string>;
/** projectId 设置及检查 */
export declare const runProjectIdForm: (token: string, projectId?: string) => Promise<string>;
export declare const runSetApiFileNameMapForm: (flatList: TSimpleTrees) => Promise<Array<IApiGroupNameMap>>;
/** 提示是否合并目录 */
export declare const runConfirmMergeDirectory: (directory: string) => Promise<boolean>;
