import { Properties } from 'devextreme/ui/validation_summary.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  validationGroup: [undefined, 'validationGroup'],
};

const a11yCheckConfig = {
  rules: {},
};

const configuration: Configuration = {
  component: 'dxValidationSummary',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
