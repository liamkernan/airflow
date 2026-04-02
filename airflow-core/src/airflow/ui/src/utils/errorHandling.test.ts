/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import type { TFunction } from "i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { toasterCreate } = vi.hoisted(() => ({
  toasterCreate: vi.fn(),
}));

vi.mock("src/components/ui", () => ({
  toaster: {
    create: toasterCreate,
  },
}));

import { createErrorToaster, getErrorStatus } from "./errorHandling";

describe("getErrorStatus", () => {
  it("returns undefined for non-objects", () => {
    expect(getErrorStatus(null)).toBeUndefined();
    expect(getErrorStatus(undefined)).toBeUndefined();
    expect(getErrorStatus("oops")).toBeUndefined();
  });

  it("reads status from error.status", () => {
    expect(getErrorStatus({ status: 418 })).toBe(418);
  });

  it("reads status from error.response.status when status is absent", () => {
    expect(getErrorStatus({ response: { status: 502 } })).toBe(502);
  });
});

describe("createErrorToaster", () => {
  const translate = vi.fn((key: string) => key) as unknown as TFunction;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not show a toast for 403 responses", () => {
    createErrorToaster({ status: 403 }, { titleKey: "common:error.title" }, translate);

    expect(toasterCreate).not.toHaveBeenCalled();
  });

  it("shows a toast for non-403 errors", () => {
    createErrorToaster(
      { message: "Something broke", status: 500 },
      { titleKey: "common:error.title" },
      translate,
    );

    expect(toasterCreate).toHaveBeenCalledWith({
      description: "Something broke",
      title: "common:error.title",
      type: "error",
    });
  });
});
