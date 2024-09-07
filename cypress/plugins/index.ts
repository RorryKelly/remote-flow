const { GoogleSocialLogin } = require("cypress-social-logins").plugins
import { deleteProject, deleteStage, deleteTask, getStagesForProject, getTaskById, getTasks, getUserAppAccount, getUserProjects, getUserProjectsById } from "../../src/lib/db";
import { AppAccount, Project, Stage, Task } from "@/lib/definitions";


/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on: any, config: any) => {
  on("task", {
    GoogleSocialLogin: GoogleSocialLogin
  });

  on('before:browser:launch', (browser: any, launchOptions: any) => {
    let removeFlags = [
      '--enable-automation',
    ];
    launchOptions.args = launchOptions.args.filter((value: any) => !removeFlags.includes(value));
    return launchOptions
  })


}
