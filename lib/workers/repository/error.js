const { raiseConfigWarningIssue } = require('./error-config');

module.exports = {
  handleError,
};

async function handleError(config, err) {
  logger.setMeta({
    repository: config.repository,
  });
  if (err.message === 'uninitiated') {
    logger.info('Repository is uninitiated - skipping');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'empty') {
    logger.info('Repository is empty - skipping');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'disabled') {
    logger.info('Repository is disabled - skipping');
    return err.message;
  }
  if (err.message === 'archived') {
    logger.info('Repository is archived - skipping');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'mirror') {
    logger.info('Repository is a mirror - skipping');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'renamed') {
    logger.info('Repository has been renamed - skipping');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'blocked') {
    delete config.branchList; // eslint-disable-line no-param-reassign
    logger.info('Repository is blocked - skipping');
    return err.message;
  }
  if (err.message === 'forbidden') {
    delete config.branchList; // eslint-disable-line no-param-reassign
    logger.info('Repository is forbidden');
    return err.message;
  }
  if (err.message === 'not-found') {
    delete config.branchList; // eslint-disable-line no-param-reassign
    logger.error('Repository is not found');
    return err.message;
  }
  if (err.message === 'fork') {
    logger.info('Repository is a fork and not manually configured - skipping');
    return err.message;
  }
  if (err.message === 'cannot-fork') {
    logger.info('Cannot fork repository - skipping');
    return err.message;
  }
  if (err.message === 'no-package-files') {
    logger.info('Repository has no package files - skipping');
    return err.message;
  }
  if (err.message === 'no-vulnerability-alerts') {
    logger.info('Repository has no vulnerability alerts - skipping');
    return err.message;
  }
  if (err.message === 'repository-changed') {
    logger.info('Repository has changed during renovation - aborting');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'config-validation') {
    delete config.branchList; // eslint-disable-line no-param-reassign
    logger.info({ error: err }, 'Repository has invalid config');
    await raiseConfigWarningIssue(config, err);
    return err.message;
  }
  if (err.message === 'registry-failure') {
    logger.info('Registry error - skipping');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'platform-failure') {
    logger.info('Platform error - skipping');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (
    err.message.includes('No space left on device') ||
    err.message === 'disk-space'
  ) {
    logger.error('Disk space error - skipping');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'rate-limit-exceeded') {
    logger.warn('Rate limit exceeded - aborting');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'bad-credentials') {
    logger.warn('Bad credentials - aborting');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'integration-unauthorized') {
    logger.warn('Integration unauthorized - aborting');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'authentication-error') {
    logger.warn('Authentication error - aborting');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'temporary-error') {
    logger.info('Temporary error - aborting');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message === 'lockfile-error') {
    delete config.branchList; // eslint-disable-line no-param-reassign
    logger.info('Lock file error - aborting');
    delete config.branchList; // eslint-disable-line no-param-reassign
    return err.message;
  }
  if (err.message.includes('The requested URL returned error: 5')) {
    logger.warn({ err }, 'Git error - aborting');
    delete config.branchList; // eslint-disable-line no-param-reassign
    // rewrite this error
    return 'platform-failure';
  }
  if (
    err.message.includes('The remote end hung up unexpectedly') ||
    err.message.includes('access denied or repository not exported')
  ) {
    logger.warn({ err }, 'Git error - aborting');
    delete config.branchList; // eslint-disable-line no-param-reassign
    // rewrite this error
    return 'platform-failure';
  }
  // Swallow this error so that other repositories can be processed
  logger.error({ err }, `Repository has unknown error`);
  // delete branchList to avoid cleaning up branches
  delete config.branchList; // eslint-disable-line no-param-reassign
  return 'unknown-error';
}
