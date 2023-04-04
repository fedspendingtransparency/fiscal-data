import buttons, {gaCopyLabelStr} from './buttons';
import * as gaHelper from "../../layouts/dataset-detail/helper";

describe('Download Modal Buttons', () => {
  let consoleInfo;
  let writeTextSpy;

  let downloadObj;
  let cancelCallback;

  beforeAll(() => {
    downloadObj = {
      dataset: {
        datasetId: null,
      }
    };
    cancelCallback = jest.fn();

    consoleInfo = global.console.info;
    global.console.info = jest.fn();
    Object.defineProperty(window.navigator, 'clipboard', {
      value: {
        writeText: jest.fn(() => Promise.resolve())
      }
    });
    writeTextSpy = jest.spyOn(window.navigator.clipboard, 'writeText');
  });

  afterAll(() => {
    global.console.info = consoleInfo;
  });

  it('has a cancel function that returns null if no download id is passed in', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(buttons.cancelButton()).toBeNull();
  });

  it('has a cancel function that returns a button', () => {
    downloadObj.dataset.datasetId = '123';
    expect(buttons.cancelButton(downloadObj, cancelCallback).type).toStrictEqual('button');
  });

  it('has a copy function that returns null if no text is passed in', () => {
    expect(buttons.copyToClipboardButton(null)).toBeNull();
  });

  it('has a copy function that returns a button with a passed in label', () => {
    const labelText = 'Dummy Label';
    const copyButton = buttons.copyToClipboardButton('Dummy Text', labelText);
    expect(copyButton.type).toStrictEqual('button');
    expect(copyButton.props.children).toStrictEqual(labelText);
  });

  it('copy button copies the passed in text to the user\'s clipboard when clicked and fires a GA event', () => {
    const textToCopy = 'Dummy Text';
    const gaSpy = jest.spyOn(gaHelper, 'generateAnalyticsEvent');
    const copyButton = buttons.copyToClipboardButton(textToCopy);
    copyButton.props.onClick();
    expect(writeTextSpy).toHaveBeenCalledWith(textToCopy);
    expect(gaSpy).toHaveBeenCalledWith(gaCopyLabelStr);
  });

});
