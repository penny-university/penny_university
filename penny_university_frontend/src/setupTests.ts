/* eslint-disable import/no-extraneous-dependencies */

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import MutationObserver from '@sheerun/mutationobserver-shim'

window.MutationObserver = MutationObserver

configure({ adapter: new Adapter() })
