# https://www.gitpod.io/docs/config-docker/
FROM gitpod/workspace-full:2022-05-25-08-50-33

RUN sudo install-packages libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb